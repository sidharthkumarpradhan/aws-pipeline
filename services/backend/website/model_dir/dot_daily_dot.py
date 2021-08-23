from .base_model import BaseModel, db
from website.decoraters_dir.decorators import add_schema


@add_schema
class DotDailyDot(BaseModel):
    __tablename__ = 'dot_daily_dot'
    daily_dot_id = db.Column(db.Integer, primary_key=True)
    daily_dot_type = db.Column(db.String(10))
    daily_dot_name = db.Column(db.String(100))
