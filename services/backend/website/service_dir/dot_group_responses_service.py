from website.model_dir.dot_group_responses import DotGroupResponses
from website.utils_dir.common_utils import getSort
from sqlalchemy import or_


def createDotGroupResponses(dotGroupResponsesJson):
    dotGroupResponses = DotGroupResponses()
    dotGroupResponses = dotGroupResponses.as_model(dotGroupResponsesJson)
    dotGroupResponses.save()
    return dotGroupResponses


def updateDotGroupResponses(dotGroupResponsesJson):
    dotGroupResponses = DotGroupResponses()
    dotGroupResponses = dotGroupResponses.as_model(dotGroupResponsesJson)
    dotGroupResponses.update()
    return dotGroupResponses


def findById(id):
    return DotGroupResponses.query.get(id)


def findAll(page, per_page, sort_column):
    return DotGroupResponses.query.order_by(getSort(sort_column)).paginate(page, per_page, error_out=False)


def findBy(**kwargs):
    condition_arr = []
    for col, val in kwargs.items():
        condition_arr.append(getattr(DotGroupResponses, col).ilike(f'{val}%'))
    condition = or_(*condition_arr)
    return DotGroupResponses.query.filter(condition).all()


def importDotGroupResponsess(dotGroupResponsessJson):
    modelList = []
    for i in dotGroupResponsessJson:
        dotGroupResponses = DotGroupResponses()
        dotGroupResponses = dotGroupResponses.as_model(i)
        modelList.append(dotGroupResponses)
    dotGroupResponses = DotGroupResponses()
    dotGroupResponses.saveAll(modelList)


def deleteById(id):
    dotGroupResponses = findById(id)
    dotGroupResponses.delete()
