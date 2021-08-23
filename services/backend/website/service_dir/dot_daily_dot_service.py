from website.model_dir.dot_daily_dot import DotDailyDot
from website.utils_dir.common_utils import getSort
from sqlalchemy import or_


def createDotDailyDot(dotDailyDotJson):
    dotDailyDot = DotDailyDot()
    dotDailyDot = dotDailyDot.as_model(dotDailyDotJson)
    dotDailyDot.save()
    return dotDailyDot


def updateDotDailyDot(dotDailyDotJson):
    dotDailyDot = DotDailyDot()
    dotDailyDot = dotDailyDot.as_model(dotDailyDotJson)
    dotDailyDot.update()
    return dotDailyDot


def findById(id):
    return DotDailyDot.query.get(id)


def findAll(page, per_page, sort_column):
    return DotDailyDot.query.order_by(getSort(sort_column)).paginate(page, per_page, error_out=False)


def findBy(**kwargs):
    condition_arr = []
    for col, val in kwargs.items():
        condition_arr.append(getattr(DotDailyDot, col).ilike(f'{val}%'))
    condition = or_(*condition_arr)
    return DotDailyDot.query.filter(condition).all()


def importDotDailyDots(dotDailyDotsJson):
    modelList = []
    for i in dotDailyDotsJson:
        dotDailyDot = DotDailyDot()
        dotDailyDot = dotDailyDot.as_model(i)
        modelList.append(dotDailyDot)
    dotDailyDot = DotDailyDot()
    dotDailyDot.saveAll(modelList)


def deleteById(id):
    dotDailyDot = findById(id)
    dotDailyDot.delete()
