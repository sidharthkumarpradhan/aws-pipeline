from .base_model import BaseModel, db
from website.decoraters_dir.decorators import add_schema


@add_schema
class DotTagsEntityRel(BaseModel):
    __tablename__ = 'dot_tags_entity_rel'
    tag_entity_id = db.Column(db.Integer, primary_key=True)
    tag_id = db.Column(db.ForeignKey('dot_tags.tag_id', ondelete='CASCADE', onupdate='CASCADE'), index=True)
    entity_id = db.Column(db.Integer)
    entity_type = db.Column(db.String(50))
    tag = db.relationship('DotTags', primaryjoin='DotTagsEntityRel.tag_id == DotTags.tag_id', lazy="joined", innerjoin=True)
