from flask import Flask, request, flash, url_for, redirect, render_template, jsonify, session, send_file
from flask_sqlalchemy import SQLAlchemy
from authlib.integrations.flask_client import OAuth
import os
from datetime import timedelta, datetime

from sqlalchemy import null
from sqlalchemy.orm.exc import NoResultFound
from werkzeug.security import generate_password_hash

from cryptography.fernet import Fernet

app = Flask(__name__)
# app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://dotexpress:Osicpl@1@localhost:3306/dot_express'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://one_user:Osicpl@1@192.168.32.174:3306/Dot_Express'
app.config['SECRET_KEY'] = "secret"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


class user(db.Model):
    id = db.Column('id', db.Integer, primary_key=True)
    username = db.Column(db.String(255))
    password = db.Column(db.String(255))

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class dot_user_details(db.Model):
    user_id = db.Column(db.Integer, primary_key=True)
    user_type = db.Column(db.String(100))
    user_email = db.Column(db.String(100))
    user_gmail = db.Column(db.String(100))
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    display_name = db.Column(db.String(255))
    date_of_creation = db.Column(db.DateTime)
    user_login_withgmail = db.Column(db.Integer)
    joincode_id = db.Column(db.Integer)
    avatar_image_file = db.Column(db.String(200))

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class dot_joincode_details(db.Model):
    __tablename__ = 'dot_joincode_details'
    joincode_id = db.Column(db.Integer, primary_key=True)
    joincode = db.Column(db.String(50), nullable=False)
    user_email = db.Column(db.String(100))
    passwd_required = db.Column(db.Integer)
    join_code_passwd = db.Column(db.String(50))
    expired_flag = db.Column(db.Integer)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


def __init__(self, *args, **kwargs):
    super().__init__(*args, **kwargs)


@app.route('/')
def show_all():
    users = user.query.get(1)
    return users.as_dict()


class my_dictionary(dict):

    # __init__ function
    def __init__(self):
        self = dict()

        # Function to add key:value

    def add(self, key, value):
        self[key] = value


@app.route('/google_auth', methods=['POST'])
def authorize():
    user_info = request.get_json(force=True)
    users = user.query.filter_by(username=user_info['email']).first()
    user_details = dot_user_details.query.filter_by(user_gmail=user_info['email']).first()
    if users is None:
        password_hash = generate_password_hash('test123')
        user_data = user(username=user_info['email'], password=password_hash)
        db.session.add(user_data)
        db.session.commit()
        email = user_info['email'] or null()
        given_name = null()
        family_name = null()
        name = user_info['name'] or null()
        picture = user_info['picture'] or null()
        dot_user_details_data = dot_user_details(user_id=user_data.id, user_type='student',
                                                 user_gmail=user_info['email'],
                                                 first_name=given_name, last_name=family_name, display_name=encrypt_message(name),
                                                 date_of_creation=datetime.now().strftime('%Y-%m-%dT%H:%M:%S'),
                                                 user_login_withgmail=1, avatar_image_file=picture)
        db.session.add(dot_user_details_data)
        db.session.commit()
        dict_obj = my_dictionary()
        dict_obj.add('username', email)
        dict_obj.add('password', 'test123')
        dict_obj.add('login_first_time', True)
        return jsonify(dict_obj)
    else:
        dict_obj = my_dictionary()
        dict_obj.add('username', users.username)
        dict_obj.add('password', 'test123')
        dict_obj.add('login_first_time', False)
        return jsonify(dict_obj)


@app.route('/joincode_auth', methods=['POST'])
def joincode_auth():
    join_code_json = request.get_json(force=True)
    joincode_details = dot_joincode_details.query.filter_by(joincode=join_code_json['joincode']).first()
    if joincode_details is None:
        dict_obj = my_dictionary()
        dict_obj.add('Error', 'invalid joincode')
        return jsonify(dict_obj)
    elif joincode_details.expired_flag == 1:
        dict_obj = my_dictionary()
        dict_obj.add('Error', 'Joincode expired')
        return jsonify(dict_obj)
    else:
        user_details = dot_user_details.query.filter_by(joincode_id=joincode_details.joincode_id).first()
        if user_details is None:
            dict_obj = my_dictionary()
            dict_obj.add('Error', 'invalid joincode / details')
            return jsonify(dict_obj)
        else:
            joincode_details.expired_flag = 1
            db.session.commit()
            dict_obj = my_dictionary()
            dict_obj.add('username', user_details.user_email)
            dict_obj.add('password', 'test123')
            return jsonify(dict_obj)


@app.route('/sign_up', methods=['POST'])
def sign_up():
    users_info = request.get_json(force=True)
    users_details = user.query.filter_by(username=users_info['email']).first()
    if users_details is None:
        create_user(users_info)
        dict_obj = my_dictionary()
        dict_obj.add('username', users_info['email'])
        dict_obj.add('password', users_info['password'])
        dict_obj.add('login_first_time', True)
        return jsonify(dict_obj)
    else:
        dict_obj = my_dictionary()
        dict_obj.add('error', "Email-id  already exists.")
        return jsonify(dict_obj)


def create_user(user_info):
    password_hash = generate_password_hash(user_info['password'])
    user_data = user(username=user_info['email'], password=password_hash)
    db.session.add(user_data)
    db.session.commit()
    email = user_info['email'] or null()
    dot_user_details_data = dot_user_details(user_id=user_data.id, user_type='student',
                                             user_gmail=user_info['email'],
                                             date_of_creation=datetime.now().strftime('%Y-%m-%dT%H:%M:%S'),
                                             user_login_withgmail=0)
    db.session.add(dot_user_details_data)
    db.session.commit()


@app.route('/file_location/<filename>', methods=['GET'])
def file_locationRoute(filename):
    path = "D:/Projects/DOTX/Codegen/services/website/uploads/" + filename
    return send_file(path, as_attachment=True)



def load_key():
    """
    Loads the key named `secret.key` from the current directory.
    """
    return open("secret.key", "rb").read()

def encrypt_message(message):
    """
    Encrypts a message
    """
    if message is not None:
        key = load_key()
        encoded_message = message.encode()
        f = Fernet(key)
        encrypted_message = f.encrypt(encoded_message)
        return encrypted_message
    else:
        return None
