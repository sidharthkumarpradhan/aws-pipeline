from .base_model import BaseModel, db
from website.decoraters_dir.decorators import add_schema


@add_schema
class DotJoincodeDetails(BaseModel):
    __tablename__ = 'dot_joincode_details'
    joincode_id = db.Column(db.Integer, primary_key=True)
    joincode = db.Column(db.String(50), nullable=False)
    user_email = db.Column(db.String(100))
    passwd_required = db.Column(db.Integer)
    join_code_passwd = db.Column(db.String(50))
    expired_flag=db.Column(db.Integer)
    invited_by=db.Column(db.String(50))
