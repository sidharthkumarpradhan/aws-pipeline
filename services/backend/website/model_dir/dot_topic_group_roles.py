from .base_model import BaseModel, db
from website.decoraters_dir.decorators import add_schema


@add_schema
class DotTopicGroupRoles(BaseModel):
    __tablename__ = 'dot_topic_group_roles'
    group_role_id = db.Column(db.Integer, primary_key=True)
    role_name = db.Column(db.String(50))
    role_description = db.Column(db.String(500))
    role_avatar = db.Column(db.String(200))
    role_guidelines = db.Column(db.String(1000))
    role_assigned_to = db.Column(db.String(50))
    role_assigned_date = db.Column(db.DateTime)
    role_status = db.Column(db.String(10))
    is_active = db.Column(db.Integer)
    group_id = db.Column(db.ForeignKey('dot_topic_group.group_id', ondelete='CASCADE'), nullable=False, index=True)
    role_id = db.Column(db.ForeignKey('dot_topic_roles.role_id', ondelete='CASCADE'), nullable=False, index=True)
    user_id = db.Column(db.ForeignKey('dot_user_details.user_id', ondelete='CASCADE'), nullable=False, index=True)
    group = db.relationship('DotTopicGroup', primaryjoin='DotTopicGroupRoles.group_id == DotTopicGroup.group_id', lazy="joined", innerjoin=True)
    role = db.relationship('DotTopicRoles', primaryjoin='DotTopicGroupRoles.role_id == DotTopicRoles.role_id', lazy="joined", innerjoin=True)
    user = db.relationship('DotUserDetails', primaryjoin='DotTopicGroupRoles.user_id == DotUserDetails.user_id', lazy="joined", innerjoin=True)
