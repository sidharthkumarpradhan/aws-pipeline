from .base_model import BaseModel, db
from website.decoraters_dir.decorators import add_schema


@add_schema
class DotTopicRespAttachments(BaseModel):
    __tablename__ = 'dot_topic_resp_attachments'
    topic_resp_attach_id = db.Column(db.Integer, primary_key=True)
    attachment_file_path = db.Column(db.String(200), nullable=False)
    file_type = db.Column(db.String(50), nullable=False)
    topic_response_id = db.Column(db.ForeignKey('dot_topic_response.topic_response_id', ondelete='CASCADE', onupdate='CASCADE'), index=True)
    topic_response = db.relationship('DotTopicResponse', primaryjoin='DotTopicRespAttachments.topic_response_id == DotTopicResponse.topic_response_id', lazy="joined", innerjoin=True)
