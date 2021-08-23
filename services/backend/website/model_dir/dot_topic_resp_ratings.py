from .base_model import BaseModel, db
from website.decoraters_dir.decorators import add_schema


@add_schema
class DotTopicRespRatings(BaseModel):
    __tablename__ = 'dot_topic_resp_ratings'
    topic_resp_rating_id = db.Column(db.Integer, primary_key=True)
    rating_category = db.Column(db.String(45))
    rating_value = db.Column(db.Integer)
    rating_comments = db.Column(db.String(200))
    rating_reaction = db.Column(db.String(50))
    topic_response_id = db.Column(db.ForeignKey('dot_topic_response.topic_response_id', ondelete='CASCADE'), nullable=False, index=True)
    user_id = db.Column(db.ForeignKey('dot_user_details.user_id', ondelete='CASCADE'), nullable=False, index=True)
    topic_response = db.relationship('DotTopicResponse', primaryjoin='DotTopicRespRatings.topic_response_id == DotTopicResponse.topic_response_id', lazy="joined", innerjoin=True)
    user = db.relationship('DotUserDetails', primaryjoin='DotTopicRespRatings.user_id == DotUserDetails.user_id', lazy="joined", innerjoin=True)
