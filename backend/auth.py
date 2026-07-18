from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from app import db
from models import User

bp = Blueprint('auth', __name__)


@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({'msg': 'email and password required'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'msg': 'email already registered'}), 400

    user = User(email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    access = create_access_token(identity=user.id)
    refresh = create_refresh_token(identity=user.id)
    return jsonify({'access_token': access, 'refresh_token': refresh, 'user': {'id': user.id, 'email': user.email}}), 201


@bp.route('/login', methods=['POST'])
def login():
    try:
        print('AUTH LOGIN START')
        print('content_type=', request.content_type)
        print('headers=', dict(request.headers))
        print('raw body=', request.get_data(as_text=True))
        data = request.get_json() or {}
        print('parsed json=', data)
        email = data.get('email')
        password = data.get('password')
        if not email or not password:
            return jsonify({'msg': 'email and password required'}), 400

        user = User.query.filter_by(email=email).first()
        if not user or not user.check_password(password):
            return jsonify({'msg': 'invalid credentials'}), 401

        access = create_access_token(identity=user.id)
        refresh = create_refresh_token(identity=user.id)
        return jsonify({'access_token': access, 'refresh_token': refresh, 'user': {'id': user.id, 'email': user.email}})
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'msg': 'internal error', 'error': str(e)}), 500


@bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    access = create_access_token(identity=identity)
    return jsonify({'access_token': access})


@bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    identity = get_jwt_identity()
    user = User.query.get(identity)
    if not user:
        return jsonify({'msg': 'user not found'}), 404
    return jsonify({'id': user.id, 'email': user.email})
