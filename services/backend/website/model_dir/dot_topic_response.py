from .base_model import BaseModel, db
from website.decoraters_dir.decorators import add_schema


@add_schema
class DotTopicResponse(BaseModel):
    __tablename__ = 'dot_topic_response'
    topic_response_id = db.Column(db.Integer, primary_key=True)
    response_description = db.Column(db.String(2000))
    date_of_response = db.Column(db.DateTime)
    attachment_file_path = db.Column(db.String(200))
    response_rating = db.Column(db.Float(asdecimal=True))
    is_final_submit = db.Column(db.Integer)
    topic_assign_id = db.Column(db.ForeignKey('dot_topic_assignments.topic_assign_id', ondelete='CASCADE'), nullable=False, index=True)
    topic_assign = db.relationship('DotTopicAssignments', primaryjoin='DotTopicResponse.topic_assign_id == DotTopicAssignments.topic_assign_id', lazy="joined", innerjoin=False,  join_depth = 0)
