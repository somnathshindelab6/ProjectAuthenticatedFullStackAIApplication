from flask import Flask, jsonify
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

    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    @app.after_request
    def add_cors_headers(response):
        response.headers.setdefault('Access-Control-Allow-Origin', '*')
        response.headers.setdefault('Access-Control-Allow-Headers', 'Authorization,Content-Type')
        response.headers.setdefault('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
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
