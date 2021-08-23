import time

from authlib.integrations.flask_oauth2 import current_token
from flask import Blueprint, request, session, url_for
from flask import render_template, redirect, jsonify
from werkzeug.security import gen_salt, generate_password_hash

from website.model_dir.base_model import db
from website.model_dir.oauth_models import User, OAuth2Client
from website.oauth2 import authorization, require_oauth
from website.utils_dir.common_utils import my_dictionary



bp = Blueprint(__name__, 'home')


def current_user():
    if 'id' in session:
        uid = session['id']
        return User.query.get(uid)
    return None


def split_by_crlf(s):
    return [v for v in s.splitlines() if v]


@bp.route('/', methods=('GET', 'POST'))
def home():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        user = User.query.filter_by(username=username).first()
        if not user:
            user = User(username=username,
                        password=generate_password_hash(password))
            db.session.add(user)
            db.session.commit()
        session['id'] = user.id
        return redirect(url_for('website.routes_dir.oauth_routes.home'))
    user = current_user()
    if user:
        clients = OAuth2Client.query.filter_by(user_id=user.id).all()
    else:
        clients = []

    return render_template('home.html', user=user, clients=clients)


@bp.route('/create_client', methods=('GET', 'POST'))
def create_client():
    user = current_user()
    if not user:
        return redirect(url_for('website.routes_dir.oauth_routes.home'))
    if request.method == 'GET':
        return render_template('create_client.html')

    client_id = gen_salt(24)
    client_id_issued_at = int(time.time())
    client = OAuth2Client(
        client_id=client_id,
        client_id_issued_at=client_id_issued_at,
        user_id=user.id,
    )

    form = request.form
    client_metadata = {
        "client_name": form["client_name"],
        "client_uri": form["client_uri"],
        "grant_types": split_by_crlf(form["grant_type"]),
        "redirect_uris": split_by_crlf(form["redirect_uri"]),
        "response_types": split_by_crlf(form["response_type"]),
        "scope": form["scope"],
        "token_endpoint_auth_method": form["token_endpoint_auth_method"]
    }
    client.set_client_metadata(client_metadata)

    if form['token_endpoint_auth_method'] == 'none':
        client.client_secret = ''
    else:
        client.client_secret = gen_salt(48)

    db.session.add(client)
    db.session.commit()
    return redirect(url_for('website.routes_dir.oauth_routes.home'))


@bp.route('/logout')
def logout():
    del session['id']
    return redirect(url_for('website.routes_dir.oauth_routes.home'))


####
# OAuth Routes
####

@bp.route('/oauth/token', methods=['POST'])
def issue_token():
    return authorization.create_token_response()


@bp.route('/oauth/revoke', methods=['POST'])
def revoke_token():
    return authorization.create_endpoint_response('revocation')


@bp.route('/oauth/verify', methods=['GET'])
@require_oauth()
def verify():
    user = current_token.user
    return jsonify(user.serialize())


####
# Protected API
####

@bp.route('/api/me')
@require_oauth()
def api_me():
    user = current_token.user
    return jsonify(id=user.id, username=user.username)



