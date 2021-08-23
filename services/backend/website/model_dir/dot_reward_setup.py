from .base_model import BaseModel, db
from website.decoraters_dir.decorators import add_schema


@add_schema
class DotRewardSetup(BaseModel):
    __tablename__ = 'dot_reward_setup'
    reward_setup_id = db.Column(db.Integer, primary_key=True)
    reward_name = db.Column(db.String(50))
    reward_description = db.Column(db.String(2000))
    reward_title = db.Column(db.String(50))
    reward_action = db.Column(db.String(50))
    reward_points = db.Column(db.Integer)
    reward_badge = db.Column(db.String(200))
    effective_date = db.Column(db.DateTime)
    expiry_date = db.Column(db.DateTime)
    topic_id = db.Column(db.ForeignKey('dot_topic_details.topic_id', ondelete='CASCADE'), nullable=False, index=True)
    topic = db.relationship('DotTopicDetails', primaryjoin='DotRewardSetup.topic_id == DotTopicDetails.topic_id', lazy="joined", innerjoin=True)
