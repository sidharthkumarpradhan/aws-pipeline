from .base_model import BaseModel, db
from website.decoraters_dir.decorators import add_schema


@add_schema
class DotTopicAttachments(BaseModel):
    __tablename__ = 'dot_topic_attachments'
    topic_attach_id = db.Column(db.Integer, primary_key=True)
    attachment_title = db.Column(db.String(50))
    attachment_description = db.Column(db.String(100))
    attachment_file_path = db.Column(db.String(200))
    topic_id = db.Column(db.ForeignKey('dot_topic_details.topic_id', ondelete='CASCADE'), nullable=False, index=True)
    topic = db.relationship('DotTopicDetails', primaryjoin='DotTopicAttachments.topic_id == DotTopicDetails.topic_id', lazy="joined", innerjoin=True)
