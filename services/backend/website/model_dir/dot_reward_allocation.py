from .base_model import BaseModel, db
from website.decoraters_dir.decorators import add_schema


@add_schema
class DotRewardAllocation(BaseModel):
    __tablename__ = 'dot_reward_allocation'
    reward_alloc_id = db.Column(db.Integer, primary_key=True)
    reward_alloc_date = db.Column(db.DateTime)
    reward_points = db.Column(db.Integer)
    reward_title = db.Column(db.String(50))
    reward_action = db.Column(db.String(50))
    reward_badge = db.Column(db.String(200))
    topic_id = db.Column(db.ForeignKey('dot_topic_details.topic_id', ondelete='CASCADE'), nullable=False, index=True)
    user_id = db.Column(db.ForeignKey('dot_user_details.user_id', ondelete='CASCADE'), nullable=False, index=True)
    topic = db.relationship('DotTopicDetails', primaryjoin='DotRewardAllocation.topic_id == DotTopicDetails.topic_id', lazy="joined", innerjoin=True)
    user = db.relationship('DotUserDetails', primaryjoin='DotRewardAllocation.user_id == DotUserDetails.user_id', lazy="joined", innerjoin=True)
