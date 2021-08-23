from .base_model import BaseModel, db
from website.decoraters_dir.decorators import add_schema


@add_schema
class DotTopicRatings(BaseModel):
    __tablename__ = 'dot_topic_ratings'
    topic_rating_id = db.Column(db.Integer, primary_key=True)
    rating_category = db.Column(db.String(20))
    rating_value = db.Column(db.Float(asdecimal=True))
    rating_comments = db.Column(db.String(200))
    topic_id = db.Column(db.ForeignKey('dot_topic_details.topic_id', ondelete='CASCADE'), nullable=False, index=True)
    user_id = db.Column(db.ForeignKey('dot_user_details.user_id', ondelete='CASCADE'), nullable=False, index=True)
    topic = db.relationship('DotTopicDetails', primaryjoin='DotTopicRatings.topic_id == DotTopicDetails.topic_id', lazy="joined", innerjoin=True)
    user = db.relationship('DotUserDetails', primaryjoin='DotTopicRatings.user_id == DotUserDetails.user_id', lazy="joined", innerjoin=True)
