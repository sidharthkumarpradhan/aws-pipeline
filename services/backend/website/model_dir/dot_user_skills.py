from .base_model import BaseModel, db
from website.decoraters_dir.decorators import add_schema


@add_schema
class DotUserSkills(BaseModel):
    __tablename__ = 'dot_user_skills'
    user_skill_id = db.Column(db.Integer, primary_key=True)
    is_primary = db.Column(db.Integer)
    skill_achievements = db.Column(db.String(2000))
    skill_file = db.Column(db.String(200))
    others_option = db.Column(db.String(200))
    user_id = db.Column(db.ForeignKey('dot_user_details.user_id', ondelete='CASCADE'), nullable=False, index=True)
    skill_id = db.Column(db.ForeignKey('dot_skill_details.skill_id', ondelete='CASCADE'), nullable=False, index=True)
    skill = db.relationship('DotSkillDetails', primaryjoin='DotUserSkills.skill_id == DotSkillDetails.skill_id', lazy="joined", innerjoin=True)
    user = db.relationship('DotUserDetails', primaryjoin='DotUserSkills.user_id == DotUserDetails.user_id', lazy="joined", innerjoin=True)
