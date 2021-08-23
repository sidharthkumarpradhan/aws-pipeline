from .base_model import BaseModel, db
from website.decoraters_dir.decorators import add_schema

@add_schema
class DotPersonalityQuiz(BaseModel):
    __tablename__ = 'dot_personality_quiz'
    quiz_id = db.Column(db.Integer, primary_key=True)
    quiz_description = db.Column(db.String(200))
    quiz_file_path = db.Column(db.String(200))
    quiz_icon_file_path = db.Column(db.String(200))
    quiz_order = db.Column(db.Integer)
    quiz_status = db.Column(db.Integer)
    type = db.Column(db.String(50))
    option1 = db.Column(db.String(50))
    option2 = db.Column(db.String(50))
    option3 = db.Column(db.String(50))
    option4 = db.Column(db.String(50))
    option5 = db.Column(db.String(50))
    option6 = db.Column(db.String(50))
    option7 = db.Column(db.String(50))
    option8 = db.Column(db.String(50))
    option9 = db.Column(db.String(50))
    option10 = db.Column(db.String(50))
    is_active = db.Column(db.Integer)
    topic_id = db.Column(db.ForeignKey('dot_topic_details.topic_id', ondelete='CASCADE'), index=True)
    topic = db.relationship('DotTopicDetails',
                          primaryjoin='DotTopicDetails.topic_id == DotPersonalityQuiz.topic_id', lazy="joined",
                          innerjoin=False)

    @property
    def serializable(self):
        return {'quiz_id': self.quiz_id, 'quiz_description':self.quiz_description, 'topic_id': self.topic_id}