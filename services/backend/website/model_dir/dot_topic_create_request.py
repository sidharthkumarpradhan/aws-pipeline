from .base_model import BaseModel, db
from website.decoraters_dir.decorators import add_schema


@add_schema
class DotTopicCreateRequest(BaseModel):
    __tablename__ = 'dot_topic_create_request'
    request_id = db.Column(db.Integer, primary_key=True)
    request_type = db.Column(db.String(15))
    request_name = db.Column(db.String(100))
    request_description = db.Column(db.String(2000))
    requested_by = db.Column(db.String(50))
    requested_date = db.Column(db.DateTime)
    request_status = db.Column(db.String(10))