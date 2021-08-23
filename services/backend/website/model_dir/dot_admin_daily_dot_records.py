from .base_model import BaseModel, db
from website.decoraters_dir.decorators import add_schema


@add_schema
class DotAdminDailyDotRecords(BaseModel):
    __tablename__ = 'dot_admin_daily_dot_records'
    admin_daily_dot_rec_id = db.Column(db.Integer, primary_key=True)
    daily_dot_type = db.Column(db.String(10))
    record_date = db.Column(db.DateTime)
    record_title = db.Column(db.String(100))
    record_description = db.Column(db.String(2000))
    record_response = db.Column(db.String(2000))
    option1 = db.Column(db.String(50))
    option2 = db.Column(db.String(50))
    option3 = db.Column(db.String(50))
    option4 = db.Column(db.String(50))
    date_of_publish = db.Column(db.DateTime)
    record_status = db.Column(db.String(20))
    is_active = db.Column(db.Integer)
    daily_dot_id = db.Column(db.Integer)
