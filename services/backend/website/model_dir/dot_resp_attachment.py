from .base_model import BaseModel, db
from website.decoraters_dir.decorators import add_schema


@add_schema
class DotRespAttachment(BaseModel):
    __tablename__ = 'dot_resp_attachment'
    resp_attacment_id = db.Column(db.Integer, primary_key=True)
    resp_attach_title = db.Column(db.String(50))
    resp_attach_description = db.Column(db.String(100))
    resp_attach_file_path = db.Column(db.String(200))
    topic_response_id = db.Column(db.ForeignKey('dot_topic_response.topic_response_id', ondelete='CASCADE'), nullable=False, index=True)
    topic_response = db.relationship('DotTopicResponse', primaryjoin='DotRespAttachment.topic_response_id == DotTopicResponse.topic_response_id', lazy="joined", innerjoin=True)
