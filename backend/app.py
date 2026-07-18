from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from config import config
import os
import sys

sys.modules.setdefault('app', sys.modules[__name__])

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()


def create_app():
    app = Flask(__name__)
    app.config.from_object(config)

    frontend_origin = os.getenv('FRONTEND_ORIGIN', 'https://somnathshindelab6.github.io')
    CORS(
        app,
        resources={r"/api/*": {"origins": [frontend_origin, 'http://localhost:3000', 'http://127.0.0.1:3000']}},
        supports_credentials=True,
        allow_headers=['Authorization', 'Content-Type', 'Accept'],
        methods=['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
    )

    @app.after_request
    def add_cors_headers(response):
        origin = request.headers.get('Origin')
        if origin in {frontend_origin, 'http://localhost:3000', 'http://127.0.0.1:3000'}:
            response.headers['Access-Control-Allow-Origin'] = origin
        response.headers.setdefault('Access-Control-Allow-Headers', 'Authorization,Content-Type,Accept')
        response.headers.setdefault('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
        response.headers.setdefault('Access-Control-Allow-Credentials', 'true')
        if request.method == 'OPTIONS':
            response.status_code = 200
        return response

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # register blueprints
    from auth import bp as auth_bp
    from ai import bp as ai_bp
    from tasks import bp as tasks_bp
    from categories import bp as categories_bp
    from documents import bp as documents_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(ai_bp, url_prefix='/api/ai')
    app.register_blueprint(tasks_bp, url_prefix='/api/tasks')
    app.register_blueprint(categories_bp, url_prefix='/api/categories')
    app.register_blueprint(documents_bp, url_prefix='/api/documents')

    @app.route('/api/health')
    def health():
        return {'status': 'ok'}

    @app.errorhandler(Exception)
    def handle_uncaught_exception(error):
        import traceback
        traceback.print_exc()
        return jsonify({'msg': 'internal error', 'error': str(error)}), 500

    return app


if __name__ == '__main__':
    app = create_app()
    # Enable debug for local testing to see full tracebacks
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=True, use_reloader=False)
