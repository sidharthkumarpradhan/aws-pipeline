from website.model_dir.dot_topic_roles import DotTopicRoles
from website.utils_dir.common_utils import getSort
from sqlalchemy import or_


def createDotTopicRoles(dotTopicRolesJson):
    dotTopicRoles = DotTopicRoles()
    dotTopicRoles = dotTopicRoles.as_model(dotTopicRolesJson)
    dotTopicRoles.save()
    return dotTopicRoles


def updateDotTopicRoles(dotTopicRolesJson):
    dotTopicRoles = DotTopicRoles()
    dotTopicRoles = dotTopicRoles.as_model(dotTopicRolesJson)
    dotTopicRoles.update()
    return dotTopicRoles


def findById(id):
    return DotTopicRoles.query.get(id)


def findAll(page, per_page, sort_column):
    return DotTopicRoles.query.order_by(getSort(sort_column)).paginate(page, per_page, error_out=False)


def findBy(**kwargs):
    condition_arr = []
    for col, val in kwargs.items():
        condition_arr.append(getattr(DotTopicRoles, col).ilike(f'{val}%'))
    condition = or_(*condition_arr)
    return DotTopicRoles.query.filter(condition).all()


def importDotTopicRoless(dotTopicRolessJson):
    modelList = []
    for i in dotTopicRolessJson:
        dotTopicRoles = DotTopicRoles()
        dotTopicRoles = dotTopicRoles.as_model(i)
        modelList.append(dotTopicRoles)
    dotTopicRoles = DotTopicRoles()
    dotTopicRoles.saveAll(modelList)


def deleteById(id):
    dotTopicRoles = findById(id)
    dotTopicRoles.delete()
