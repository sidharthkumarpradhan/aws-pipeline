from .base_model import BaseModel, db
from website.decoraters_dir.decorators import add_schema


@add_schema
class DotLoginHistory(BaseModel):
    __tablename__ = 'dot_login_history'
    login_hist_id = db.Column(db.Integer, primary_key=True)
    login_id = db.Column(db.String(50))
    login_date_time = db.Column(db.DateTime)
    logout_date_time = db.Column(db.DateTime)
    login_location = db.Column(db.String(10))
    user_id = db.Column(db.ForeignKey('dot_user_details.user_id', ondelete='CASCADE'), index=True)
    user = db.relationship('DotUserDetails', primaryjoin='DotLoginHistory.user_id == DotUserDetails.user_id', lazy="joined", innerjoin=True)
