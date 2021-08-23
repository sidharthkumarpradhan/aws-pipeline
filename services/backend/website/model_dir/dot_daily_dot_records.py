from .base_model import BaseModel, db
from website.decoraters_dir.decorators import add_schema


@add_schema
class DotDailyDotRecords(BaseModel):
    __tablename__ = 'dot_daily_dot_records'
    daily_dot_rec_id = db.Column(db.Integer, primary_key=True)
    record_date = db.Column(db.DateTime)
    record_title = db.Column(db.String(100))
    record_description = db.Column(db.String(2000))
    record_response = db.Column(db.String(2000))
    option1 = db.Column(db.String(50))
    option2 = db.Column(db.String(50))
    option3 = db.Column(db.String(50))
    option4 = db.Column(db.String(50))
    is_deleted = db.Column(db.Integer)
    file_upload_path = db.Column(db.String(200))
    daily_dot_id = db.Column(db.ForeignKey('dot_daily_dot.daily_dot_id', ondelete='CASCADE'), nullable=False, index=True)
    user_id = db.Column(db.ForeignKey('dot_user_details.user_id', ondelete='CASCADE'), nullable=False,
                             index=True)
    daily_dot = db.relationship('DotDailyDot',
                                primaryjoin='DotDailyDotRecords.daily_dot_id == DotDailyDot.daily_dot_id',
                                lazy="joined", innerjoin=True)
    user = db.relationship('DotUserDetails', primaryjoin='DotDailyDotRecords.user_id == DotUserDetails.user_id', lazy="joined", innerjoin=True)
