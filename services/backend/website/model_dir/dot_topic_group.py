from .base_model import BaseModel, db
from website.decoraters_dir.decorators import add_schema


@add_schema
class DotTopicGroup(BaseModel):
    __tablename__ = 'dot_topic_group'
    group_id = db.Column(db.Integer, primary_key=True)
    group_name = db.Column(db.String(100))
    group_description = db.Column(db.String(200))
    group_status = db.Column(db.String(10))
    group_owner = db.Column(db.String(50))
    group_image = db.Column(db.String(200))
    is_active = db.Column(db.Integer)
    final_submitted = db.Column(db.Integer)
    topic_id = db.Column(db.ForeignKey('dot_topic_details.topic_id', ondelete='CASCADE'), nullable=False, index=True)
    topic = db.relationship('DotTopicDetails', primaryjoin='DotTopicGroup.topic_id == DotTopicDetails.topic_id', lazy="joined", innerjoin=True, join_depth = 1)
