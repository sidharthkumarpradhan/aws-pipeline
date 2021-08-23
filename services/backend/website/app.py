from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mail import Mail
from .model_dir.base_model import db
from .oauth2 import config_oauth
from .exceptions_dir.base_exceptions import BadRequest
from marshmallow.exceptions import ValidationError
from sqlalchemy.exc import SQLAlchemyError
from .routes_dir.oauth_routes import bp
from .routes_dir.dot_admin_daily_dot_records_routes import bp as dot_admin_daily_dot_records_bp
from .routes_dir.dot_joincode_details_routes import bp as dot_joincode_details_bp
from .routes_dir.dot_skill_details_routes import bp as dot_skill_details_bp
from .routes_dir.dot_user_details_routes import bp as dot_user_details_bp
from .routes_dir.dot_topic_create_request_routes import bp as dot_topic_create_request_bp
from .routes_dir.dot_topic_details_routes import bp as dot_topic_details_bp
from .routes_dir.dot_topic_roles_routes import bp as dot_topic_roles_bp
from .routes_dir.dot_rewards_routes import bp as dot_rewards_bp
from .routes_dir.dot_personality_quiz_routes import bp as dot_personality_quiz_bp
from .routes_dir.dot_login_history_routes import bp as dot_login_history_bp
from .routes_dir.dot_std_per_quiz_details_routes import bp as dot_std_per_quiz_details_bp
from .routes_dir.dot_user_skills_routes import bp as dot_user_skills_bp
from .routes_dir.dot_daily_dot_routes import bp as dot_daily_dot_bp
from .routes_dir.dot_daily_dot_records_routes import bp as dot_daily_dot_records_bp
from .routes_dir.dot_topic_group_routes import bp as dot_topic_group_bp
from .routes_dir.dot_topic_group_roles_routes import bp as dot_topic_group_roles_bp
from .routes_dir.dot_topic_assignments_routes import bp as dot_topic_assignments_bp
from .routes_dir.dot_topic_attachments_routes import bp as dot_topic_attachments_bp
from .routes_dir.dot_topic_response_routes import bp as dot_topic_response_bp
from .routes_dir.dot_topic_resp_attachments_routes import bp as dot_topic_resp_attachments_bp
from .routes_dir.dot_topic_resp_comments_routes import bp as dot_topic_resp_comments_bp
from .routes_dir.dot_resp_attachment_routes import bp as dot_resp_attachment_bp
from .routes_dir.dot_topic_ratings_routes import bp as dot_topic_ratings_bp
from .routes_dir.dot_reward_setup_routes import bp as dot_reward_setup_bp
from .routes_dir.dot_reward_allocation_routes import bp as dot_reward_allocation_bp
from .routes_dir.dot_group_white_board_routes import bp as dot_group_white_board_bp
from .routes_dir.dot_group_responses_routes import bp as dot_group_responses_bp
from .routes_dir.dot_topic_resp_ratings_routes import bp as dot_topic_resp_ratings_bp
from .routes_dir.dot_files import bp as dot_files_bp

# EOL - import route

mail = Mail()
def create_app(config=None):
    app = Flask(__name__)
    # Added CORS handling ability
    # CORS(app)
    # load default configuration
    app.config.from_object('website.settings')
    # load app specified configuration
    if config is not None:
        if isinstance(config, dict):
            app.config.update(config)
        elif config.endswith('.py'):
            app.config.from_pyfile(config)


    setup_app(app)
    mail = Mail(app)
    app.mail = mail
    return app


def setup_app(app):
    # Create tables if they do not exist already
    @app.before_first_request
    def create_tables():
        db.create_all()

    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Credentials', "true")
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,\
             Accept, X-Requested-With, username, password, Cache-Control,\
                  Pragma, Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,\
            POST,DELETE,OPTIONS')
        if request.method == 'OPTIONS':
            return app.response_class(response=response.get_json(), status=200)
        return response

    @app.errorhandler(BadRequest)
    def handle_bad_request(error):
        """Catch BadRequest exception globally, serialize into JSON, and respond with 400."""
        payload = dict(error.payload or ())
        payload['status'] = error.status
        payload['message'] = error.message
        return jsonify(payload), 400

    @app.errorhandler(ValidationError)
    def handle_marshmallow_request(error):
        """Catch BadRequest exception globally, serialize into JSON, and respond with 400."""
        payload = {}
        payload['status'] = 'M001'
        payload['message'] = error.normalized_messages()
        return jsonify(payload), 400

    @app.errorhandler(SQLAlchemyError)
    def handle_marshmallow_request(error):
        """Catch BadRequest exception globally, serialize into JSON, and respond with 400."""
        payload = {}
        payload['status'] = 'SQL001'
        payload['message'] = str(error)
        return jsonify(payload), 400

    @app.errorhandler(Exception)
    def handle_marshmallow_request(error):
        """Catch BadRequest exception globally, serialize into JSON, and respond with 400."""
        payload = {}
        payload['status'] = 'A001'
        payload['message'] = str(error)
        return jsonify(payload), 400

    db.init_app(app)
    config_oauth(app)

    app.register_blueprint(bp, url_prefix='/api/v1/user')
    app.register_blueprint(dot_admin_daily_dot_records_bp, url_prefix='/api/v1/dot-admin-daily-dot-records')
    app.register_blueprint(dot_daily_dot_records_bp, url_prefix='/api/v1/dot-daily-dot-records')
    app.register_blueprint(dot_daily_dot_bp, url_prefix='/api/v1/dot-daily-dot')
    app.register_blueprint(dot_group_responses_bp, url_prefix='/api/v1/dot-group-responses')
    app.register_blueprint(dot_group_white_board_bp, url_prefix='/api/v1/dot-group-white-board')
    app.register_blueprint(dot_joincode_details_bp, url_prefix='/api/v1/dot-joincode-details')
    app.register_blueprint(dot_login_history_bp, url_prefix='/api/v1/dot-login-history')
    app.register_blueprint(dot_personality_quiz_bp, url_prefix='/api/v1/dot-personality-quiz')
    app.register_blueprint(dot_resp_attachment_bp, url_prefix='/api/v1/dot-resp-attachment')
    app.register_blueprint(dot_rewards_bp, url_prefix='/api/v1/dot-rewards')
    app.register_blueprint(dot_reward_allocation_bp, url_prefix='/api/v1/dot-reward-allocation')
    app.register_blueprint(dot_reward_setup_bp, url_prefix='/api/v1/dot-reward-setup')
    app.register_blueprint(dot_skill_details_bp, url_prefix='/api/v1/dot-skill-details')
    app.register_blueprint(dot_std_per_quiz_details_bp, url_prefix='/api/v1/dot-std-per-quiz-details')
    app.register_blueprint(dot_topic_assignments_bp, url_prefix='/api/v1/dot-topic-assignments')
    app.register_blueprint(dot_topic_attachments_bp, url_prefix='/api/v1/dot-topic-attachments')
    app.register_blueprint(dot_topic_create_request_bp, url_prefix='/api/v1/dot-topic-create-request')
    app.register_blueprint(dot_topic_details_bp, url_prefix='/api/v1/dot-topic-details')
    app.register_blueprint(dot_topic_roles_bp, url_prefix='/api/v1/dot-topic-roles')
    app.register_blueprint(dot_topic_group_roles_bp, url_prefix='/api/v1/dot-topic-group-roles')
    app.register_blueprint(dot_topic_group_bp, url_prefix='/api/v1/dot-topic-group')
    app.register_blueprint(dot_topic_ratings_bp, url_prefix='/api/v1/dot-topic-ratings')
    app.register_blueprint(dot_topic_response_bp, url_prefix='/api/v1/dot-topic-response')
    app.register_blueprint(dot_topic_resp_attachments_bp, url_prefix='/api/v1/dot-topic-resp-attachments')
    app.register_blueprint(dot_topic_resp_comments_bp, url_prefix='/api/v1/dot-topic-resp-comments')
    app.register_blueprint(dot_user_details_bp, url_prefix='/api/v1/dot-user-details')
    app.register_blueprint(dot_user_skills_bp, url_prefix='/api/v1/dot-user-skills')
    app.register_blueprint(dot_topic_resp_ratings_bp, url_prefix='/api/v1/dot-topic-resp-ratings')
    app.register_blueprint(dot_files_bp, url_prefix='/api/v1/dot-files')
    # EOL - app.register
    CORS(app, resources={r"/api/*": {"origins": "*"}})
