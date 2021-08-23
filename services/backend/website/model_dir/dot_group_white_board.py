from .base_model import BaseModel, db
from website.decoraters_dir.decorators import add_schema


@add_schema
class DotGroupWhiteBoard(BaseModel):
    __tablename__ = 'dot_group_white_board'
    board_id = db.Column(db.Integer, primary_key=True)
    board_title = db.Column(db.String(50))
    content_file_path = db.Column(db.String(200))
    group_id = db.Column(db.ForeignKey('dot_topic_group.group_id', ondelete='CASCADE'), nullable=False, index=True)
    group = db.relationship('DotTopicGroup', primaryjoin='DotGroupWhiteBoard.group_id == DotTopicGroup.group_id', lazy="joined", innerjoin=True)
