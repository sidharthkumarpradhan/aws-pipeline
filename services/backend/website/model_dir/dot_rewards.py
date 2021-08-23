from .base_model import BaseModel, db
from website.decoraters_dir.decorators import add_schema


@add_schema
class DotRewards(BaseModel):
    __tablename__ = 'dot_rewards'
    reward_id = db.Column(db.Integer, primary_key=True)
    reward_name = db.Column(db.String(50))
    reward_description = db.Column(db.String(200))
    reward_type = db.Column(db.String(20))
    reward_points = db.Column(db.Float(asdecimal=True))
