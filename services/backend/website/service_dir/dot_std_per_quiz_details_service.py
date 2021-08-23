from authlib.integrations.flask_oauth2 import current_token

from website.model_dir.dot_std_per_quiz_details import DotStdPerQuizDetails
from website.model_dir.dot_personality_quiz import DotPersonalityQuiz
from website.utils_dir.common_utils import getSort
from sqlalchemy import or_, and_


def createDotStdPerQuizDetails(dotStdPerQuizDetailsJson):
    if 'quiz' in dotStdPerQuizDetailsJson:
        dotStdPerQuizDetailss = DotStdPerQuizDetails.query.filter(
            and_(DotStdPerQuizDetails.user_id == current_token.user.id, DotStdPerQuizDetails.quiz_id == dotStdPerQuizDetailsJson['quiz'])).delete()
        bulk_addDotStdPerQuizDetailss(dotStdPerQuizDetailsJson)


def updateDotStdPerQuizDetails(dotStdPerQuizDetailsJson):
    dotStdPerQuizDetails = DotStdPerQuizDetails()
    dotStdPerQuizDetails = dotStdPerQuizDetails.as_model(dotStdPerQuizDetailsJson)
    dotStdPerQuizDetails.update()
    return dotStdPerQuizDetails


def findById(id):
    return DotStdPerQuizDetails.query.get(id)


def findAll(page, per_page, sort_column):
    return DotStdPerQuizDetails.query.order_by(getSort(sort_column)).paginate(page, per_page, error_out=False)


def findBy(**kwargs):
    condition_arr = []
    for col, val in kwargs.items():
        condition_arr.append(getattr(DotStdPerQuizDetails, col).ilike(f'{val}%'))
    condition = or_(*condition_arr)
    return DotStdPerQuizDetails.query.filter(condition).all()


def importDotStdPerQuizDetailss(dotStdPerQuizDetailssJson):
    modelList = []
    for i in dotStdPerQuizDetailssJson:
        dotStdPerQuizDetails = DotStdPerQuizDetails()
        dotStdPerQuizDetails = dotStdPerQuizDetails.as_model(i)
        modelList.append(dotStdPerQuizDetails)
    dotStdPerQuizDetails = DotStdPerQuizDetails()
    dotStdPerQuizDetails.saveAll(modelList)


def deleteById(id):
    dotStdPerQuizDetails = findById(id)
    dotStdPerQuizDetails.delete()


def bulk_addDotStdPerQuizDetailss(dotStdPerQuizDetailssJson):
    for i in dotStdPerQuizDetailssJson['selected_options']:
        dotStdPerQuizDetails = DotStdPerQuizDetails()
        dotStdPerQuizDetails.quiz_id = dotStdPerQuizDetailssJson['quiz']
        dotStdPerQuizDetails.user_id = current_token.user.id
        dotStdPerQuizDetails.quiz_response = i['option']
        if 'quiz_response_notes' in i:
            dotStdPerQuizDetails.quiz_response_notes = i['quiz_response_notes']
        dotStdPerQuizDetails.quiz_status = 1
        dotStdPerQuizDetails.save()


def studentQuizDetails():
    dotStdPerQuizDetailsOps = DotPersonalityQuiz.query.with_entities(DotPersonalityQuiz.quiz_id,
                                                                     DotPersonalityQuiz.quiz_description,
                                                                     DotPersonalityQuiz.quiz_file_path,
                                                                     DotPersonalityQuiz.quiz_icon_file_path,
                                                                     DotPersonalityQuiz.quiz_order,
                                                                     DotPersonalityQuiz.quiz_status,
                                                                     DotPersonalityQuiz.type,
                                                                     DotPersonalityQuiz.option1,
                                                                     DotPersonalityQuiz.option2,
                                                                     DotPersonalityQuiz.option3,
                                                                     DotPersonalityQuiz.option4,
                                                                     DotPersonalityQuiz.option5,
                                                                     DotPersonalityQuiz.option6,
                                                                     DotPersonalityQuiz.option7,
                                                                     DotPersonalityQuiz.option8,
                                                                     DotPersonalityQuiz.option9,
                                                                     DotPersonalityQuiz.option10,
                                                                     DotPersonalityQuiz.topic_id,
                                                                     DotPersonalityQuiz.is_active,
                                                                     DotPersonalityQuiz.created_by,
                                                                     DotPersonalityQuiz.created_date,
                                                                     DotPersonalityQuiz.lastmodified_by,
                                                                     DotPersonalityQuiz.lastmodified_date
                                                                     ).all()
    return dotStdPerQuizDetailsOps


def responseQuizDetails(quiz_id):
    dotStdPerQuizDetails = DotStdPerQuizDetails.query.filter(and_(DotStdPerQuizDetails.quiz_id == quiz_id, DotStdPerQuizDetails.user_id == current_token.user.id)).all()
    return dotStdPerQuizDetails
