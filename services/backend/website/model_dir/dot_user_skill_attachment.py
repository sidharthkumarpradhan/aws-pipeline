from .base_model import BaseModel, db
from website.decoraters_dir.decorators import add_schema


@add_schema
class DotUserSkillAttachment(BaseModel):
    __tablename__ = 'dot_user_skill_attachment'
    dot_user_skill_attach_id = db.Column(db.Integer, primary_key=True)
    user_skill_file = db.Column(db.String(200), nullable=False)
    display_name = db.Column(db.String(200))
    file_type = db.Column(db.String(50))
    user_skill_id = db.Column(db.ForeignKey('dot_user_skills.user_skill_id'), index=True)
    user_skill = db.relationship('DotUserSkills', primaryjoin='DotUserSkillAttachment.user_skill_id == DotUserSkills.user_skill_id', cascade='save-update, merge, delete', lazy="joined", innerjoin=True)
