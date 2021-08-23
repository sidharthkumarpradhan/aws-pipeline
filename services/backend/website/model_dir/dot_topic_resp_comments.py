from .base_model import BaseModel, db
from website.decoraters_dir.decorators import add_schema


@add_schema
class DotTopicRespComments(BaseModel):
    __tablename__ = 'dot_topic_resp_comments'
    topic_resp_comment_id = db.Column(db.Integer, primary_key=True)
    comment_notes = db.Column(db.String(2000), nullable=False)
    topic_response_id = db.Column(db.ForeignKey('dot_topic_response.topic_response_id', ondelete='CASCADE', onupdate='CASCADE'), index=True)
    user_id = db.Column(db.ForeignKey('dot_user_details.user_id', ondelete='CASCADE', onupdate='CASCADE'), index=True)
    topic_response = db.relationship('DotTopicResponse', primaryjoin='DotTopicRespComments.topic_response_id == DotTopicResponse.topic_response_id', lazy="joined", innerjoin=True)
    user = db.relationship('DotUserDetails', primaryjoin='DotTopicRespComments.user_id == DotUserDetails.user_id', lazy="joined", innerjoin=True)
