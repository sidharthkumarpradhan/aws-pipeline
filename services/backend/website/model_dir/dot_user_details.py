from .base_model import BaseModel, db
from website.decoraters_dir.decorators import add_schema


@add_schema
class DotUserDetails(BaseModel):
    __tablename__ = 'dot_user_details'
    user_id = db.Column(db.Integer, primary_key=True)
    user_code = db.Column(db.String(50))
    user_type = db.Column(db.String(10))
    first_name = db.Column(db.String(50))
    middle_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    display_name = db.Column(db.String(255))
    gender = db.Column(db.String(10))
    user_phone_num = db.Column(db.String(255))
    user_email = db.Column(db.String(100))
    user_gmail = db.Column(db.String(100))
    date_of_creation = db.Column(db.DateTime)
    date_of_exit = db.Column(db.DateTime)
    user_login_id = db.Column(db.String(100))
    user_password = db.Column(db.String(50))
    is_temp_passwd = db.Column(db.Integer)
    user_login_withgmail = db.Column(db.Integer)
    user_login_user_id = db.Column(db.Integer)
    school_name = db.Column(db.String(100))
    class_details = db.Column(db.String(10))
    user_about_me = db.Column(db.String(2000))
    avatar_image_file = db.Column(db.String(200))
    user_dob = db.Column(db.DateTime)
    user_bio_video_file =  db.Column(db.String(200))
    joincode_id = db.Column(db.ForeignKey('dot_joincode_details.joincode_id', ondelete='CASCADE'), index=True)
    joincode = db.relationship('DotJoincodeDetails', primaryjoin='DotUserDetails.joincode_id == DotJoincodeDetails.joincode_id', lazy="joined", innerjoin=False)
