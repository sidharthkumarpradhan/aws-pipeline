from website.model_dir.dot_personality_quiz import DotPersonalityQuiz
from website.utils_dir.common_utils import getSort
from sqlalchemy import or_


def createDotPersonalityQuiz(dotPersonalityQuizJson):
    dotPersonalityQuiz = DotPersonalityQuiz()
    dotPersonalityQuiz = dotPersonalityQuiz.as_model(dotPersonalityQuizJson)
    dotPersonalityQuiz.save()
    return dotPersonalityQuiz


def updateDotPersonalityQuiz(dotPersonalityQuizJson):
    dotPersonalityQuiz = DotPersonalityQuiz()
    dotPersonalityQuiz = dotPersonalityQuiz.as_model(dotPersonalityQuizJson)
    dotPersonalityQuiz.update()
    return dotPersonalityQuiz


def findById(id):
    return DotPersonalityQuiz.query.get(id)


def findAll(page, per_page, sort_column):
    return DotPersonalityQuiz.query.order_by(getSort(sort_column)).paginate(page, per_page, error_out=False)


def findBy(**kwargs):
    condition_arr = []
    for col, val in kwargs.items():
        condition_arr.append(getattr(DotPersonalityQuiz, col).ilike(f'{val}%'))
    condition = or_(*condition_arr)
    return DotPersonalityQuiz.query.filter(condition).all()


def importDotPersonalityQuizs(dotPersonalityQuizsJson):
    modelList = []
    for i in dotPersonalityQuizsJson:
        dotPersonalityQuiz = DotPersonalityQuiz()
        dotPersonalityQuiz = dotPersonalityQuiz.as_model(i)
        modelList.append(dotPersonalityQuiz)
    dotPersonalityQuiz = DotPersonalityQuiz()
    dotPersonalityQuiz.saveAll(modelList)


def deleteById(id):
    dotPersonalityQuiz = findById(id)
    dotPersonalityQuiz.delete()
