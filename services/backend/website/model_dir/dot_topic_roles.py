from .base_model import BaseModel, db
from website.decoraters_dir.decorators import add_schema


@add_schema
class DotTopicRoles(BaseModel):
    __tablename__ = 'dot_topic_roles'
    role_id = db.Column(db.Integer, primary_key=True)
    role_name = db.Column(db.String(50), nullable=False)
    role_img = db.Column(db.String(200), nullable=False)
    topic_id = db.Column(db.ForeignKey('dot_topic_details.topic_id'), nullable=False, index=True)
    topic = db.relationship('DotTopicDetails', primaryjoin='DotTopicRoles.topic_id == DotTopicDetails.topic_id', lazy="joined", innerjoin=True)
