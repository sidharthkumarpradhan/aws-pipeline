from .base_model import BaseModel, db
from website.decoraters_dir.decorators import add_schema


@add_schema
class DotSkillDetails(BaseModel):
    __tablename__ = 'dot_skill_details'
    skill_id = db.Column(db.Integer, primary_key=True)
    skill_name = db.Column(db.String(50))
    skill_description = db.Column(db.String(200))
    skill_category = db.Column(db.String(10))