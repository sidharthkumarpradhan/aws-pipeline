from .base_model import BaseModel, db
from website.decoraters_dir.decorators import add_schema


@add_schema
class DotTopicAssignments(BaseModel):
    __tablename__ = 'dot_topic_assignments'
    topic_assign_id = db.Column(db.Integer, primary_key=True)
    assignment_status = db.Column(db.String(20))
    date_of_assignment = db.Column(db.DateTime)
    assigned_by = db.Column(db.String(50))
    assign_feedback_option = db.Column(db.String(10))
    assign_feedback_notes = db.Column(db.String(100))
    assign_parent_id = db.Column(db.Integer)
    final_submitted = db.Column(db.Integer)
    user_id = db.Column(db.ForeignKey('dot_user_details.user_id', ondelete='CASCADE'), nullable=False, index=True)
    topic_id = db.Column(db.ForeignKey('dot_topic_details.topic_id', ondelete='CASCADE'), nullable=False, index=True)
    joincode_id = db.Column(db.ForeignKey('dot_joincode_details.joincode_id', ondelete='CASCADE'), index=True)
    group_id = db.Column(db.ForeignKey('dot_topic_group.group_id', ondelete='CASCADE'), index=True)
    autoassign_flag = db.Column(db.Integer)
    joincode = db.relationship('DotJoincodeDetails', primaryjoin= 'DotTopicAssignments.joincode_id == DotJoincodeDetails.joincode_id', lazy="joined", innerjoin=False, join_depth =1)
    topic = db.relationship('DotTopicDetails', primaryjoin='DotTopicAssignments.topic_id == DotTopicDetails.topic_id', lazy="joined", innerjoin=True, join_depth =1)
    user = db.relationship('DotUserDetails', primaryjoin='DotTopicAssignments.user_id == DotUserDetails.user_id', lazy="joined", innerjoin=True, join_depth =1)
    group = db.relationship('DotTopicGroup', primaryjoin='DotTopicAssignments.group_id == DotTopicGroup.group_id', lazy="joined", innerjoin=False, join_depth =1)


