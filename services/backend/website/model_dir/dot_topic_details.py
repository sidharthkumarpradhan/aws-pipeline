from .base_model import BaseModel, db
from website.decoraters_dir.decorators import add_schema


@add_schema
class DotTopicDetails(BaseModel):
    __tablename__ = 'dot_topic_details'
    topic_id = db.Column(db.Integer, primary_key=True)
    topic_type = db.Column(db.String(15))
    topic_name = db.Column(db.String(100))
    topic_description = db.Column(db.String(2000))
    topic_duration = db.Column(db.Float(asdecimal=True))
    topic_earning_title = db.Column(db.String(100))
    topic_earning_badge = db.Column(db.String(100))
    topic_dot_coins = db.Column(db.Integer)
    topic_broadcast = db.Column(db.Integer)
    topic_status = db.Column(db.String(10))
    is_active = db.Column(db.Integer)
    topic_start_date = db.Column(db.DateTime)
    topic_end_date = db.Column(db.DateTime)
    topic_group_size = db.Column(db.Integer)
    parent_topic_id = db.Column(db.Integer)
    topic_seq = db.Column(db.Integer)
    topic_image = db.Column(db.String(200))
    is_spotlight = db.Column(db.Integer)
    is_influencer_challenge = db.Column(db.Integer)
    influencer_name = db.Column(db.String(155))
    published_date = db.Column(db.DateTime)
    participation_dot_coins = db.Column(db.Integer)
    topic_level = db.Column(db.String(50))
    request_id = db.Column(db.ForeignKey('dot_topic_create_request.request_id', ondelete='CASCADE'), index=True)
    request = db.relationship('DotTopicCreateRequest', primaryjoin='DotTopicDetails.request_id == DotTopicCreateRequest.request_id', lazy="joined", innerjoin=False)
    #questmap = db.relationship('DotTopicDetails quest_items', primaryjoin='quest_items.parent_topic_id == DotTopicDetails.request_id', lazy="joined", innerjoin=False)

    @property
    def serializable(self):
        return {'topic_id': self.topic_id, 'topic_type': self.topic_type, 'parent_topic_id': self.parent_topic_id}