from .base_model import BaseModel, db
from website.decoraters_dir.decorators import add_schema


@add_schema
class DotGroupResponses(BaseModel):
    __tablename__ = 'dot_group_responses'
    group_response_id = db.Column(db.Integer, primary_key=True)
    group_id = db.Column(db.ForeignKey('dot_topic_group.group_id', ondelete='CASCADE'), nullable=False, index=True)
    topic_response_id = db.Column(db.ForeignKey('dot_topic_response.topic_response_id'), nullable=False, index=True)
    group = db.relationship('DotTopicGroup', primaryjoin='DotGroupResponses.group_id == DotTopicGroup.group_id', lazy="joined", innerjoin=True)
    topic_response = db.relationship('DotTopicResponse', primaryjoin='DotGroupResponses.topic_response_id == DotTopicResponse.topic_response_id', lazy="joined", innerjoin=True)
