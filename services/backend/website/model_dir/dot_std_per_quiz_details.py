from .base_model import BaseModel, db
from website.decoraters_dir.decorators import add_schema


@add_schema
class DotStdPerQuizDetails(BaseModel):
    __tablename__ = 'dot_std_per_quiz_details'
    stud_quiz_id = db.Column(db.Integer, primary_key=True)
    quiz_status = db.Column(db.String(10))
    quiz_start_date = db.Column(db.DateTime)
    quiz_completion_date = db.Column(db.DateTime)
    quiz_response = db.Column(db.String(50))
    quiz_response_notes = db.Column(db.Text)
    quiz_id = db.Column(db.ForeignKey('dot_personality_quiz.quiz_id', ondelete='CASCADE'), nullable=False, index=True)
    user_id = db.Column(db.ForeignKey('dot_user_details.user_id', ondelete='CASCADE'), nullable=False, index=True)
    quiz = db.relationship('DotPersonalityQuiz', primaryjoin='DotStdPerQuizDetails.quiz_id == DotPersonalityQuiz.quiz_id', lazy="joined", innerjoin=True)
    user = db.relationship('DotUserDetails', primaryjoin='DotStdPerQuizDetails.user_id == DotUserDetails.user_id', lazy="joined", innerjoin=True)
