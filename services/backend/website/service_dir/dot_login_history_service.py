from website.model_dir.dot_login_history import DotLoginHistory
from website.utils_dir.common_utils import getSort
from sqlalchemy import or_


def createDotLoginHistory(dotLoginHistoryJson):
    dotLoginHistory = DotLoginHistory()
    dotLoginHistory = dotLoginHistory.as_model(dotLoginHistoryJson)
    dotLoginHistory.save()
    return dotLoginHistory


def updateDotLoginHistory(dotLoginHistoryJson):
    dotLoginHistory = DotLoginHistory()
    dotLoginHistory = dotLoginHistory.as_model(dotLoginHistoryJson)
    dotLoginHistory.update()
    return dotLoginHistory


def findById(id):
    return DotLoginHistory.query.get(id)


def findAll(page, per_page, sort_column):
    return DotLoginHistory.query.order_by(getSort(sort_column)).paginate(page, per_page, error_out=False)


def findBy(**kwargs):
    condition_arr = []
    for col, val in kwargs.items():
        condition_arr.append(getattr(DotLoginHistory, col).ilike(f'{val}%'))
    condition = or_(*condition_arr)
    return DotLoginHistory.query.filter(condition).all()


def importDotLoginHistorys(dotLoginHistorysJson):
    modelList = []
    for i in dotLoginHistorysJson:
        dotLoginHistory = DotLoginHistory()
        dotLoginHistory = dotLoginHistory.as_model(i)
        modelList.append(dotLoginHistory)
    dotLoginHistory = DotLoginHistory()
    dotLoginHistory.saveAll(modelList)


def deleteById(id):
    dotLoginHistory = findById(id)
    dotLoginHistory.delete()
