from website.model_dir.dot_topic_create_request import DotTopicCreateRequest
from website.utils_dir.common_utils import getSort
from sqlalchemy import or_


def createDotTopicCreateRequest(dotTopicCreateRequestJson):
    dotTopicCreateRequest = DotTopicCreateRequest()
    dotTopicCreateRequest = dotTopicCreateRequest.as_model(dotTopicCreateRequestJson)
    dotTopicCreateRequest.save()
    return dotTopicCreateRequest


def updateDotTopicCreateRequest(dotTopicCreateRequestJson):
    dotTopicCreateRequest = DotTopicCreateRequest()
    dotTopicCreateRequest = dotTopicCreateRequest.as_model(dotTopicCreateRequestJson)
    dotTopicCreateRequest.update()
    return dotTopicCreateRequest


def findById(id):
    return DotTopicCreateRequest.query.get(id)


def findAll(page, per_page, sort_column):
    return DotTopicCreateRequest.query.order_by(getSort(sort_column)).paginate(page, per_page, error_out=False)


def findBy(**kwargs):
    condition_arr = []
    for col, val in kwargs.items():
        condition_arr.append(getattr(DotTopicCreateRequest, col).ilike(f'{val}%'))
    condition = or_(*condition_arr)
    return DotTopicCreateRequest.query.filter(condition).all()


def importDotTopicCreateRequests(dotTopicCreateRequestsJson):
    modelList = []
    for i in dotTopicCreateRequestsJson:
        dotTopicCreateRequest = DotTopicCreateRequest()
        dotTopicCreateRequest = dotTopicCreateRequest.as_model(i)
        modelList.append(dotTopicCreateRequest)
    dotTopicCreateRequest = DotTopicCreateRequest()
    dotTopicCreateRequest.saveAll(modelList)


def deleteById(id):
    dotTopicCreateRequest = findById(id)
    dotTopicCreateRequest.delete()
