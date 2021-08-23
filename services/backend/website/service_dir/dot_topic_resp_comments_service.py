from website.model_dir.dot_topic_resp_comments import DotTopicRespComments
from website.utils_dir.common_utils import getSort
from sqlalchemy import or_
from authlib.integrations.flask_oauth2 import current_token


def createDotTopicRespComments(dotTopicRespCommentsJson):
    dotTopicRespComments = DotTopicRespComments()
    dotTopicRespComments = dotTopicRespComments.as_model(dotTopicRespCommentsJson)
    dotTopicRespComments.save()
    return dotTopicRespComments


def updateDotTopicRespComments(dotTopicRespCommentsJson):
    dotTopicRespComments = DotTopicRespComments()
    dotTopicRespComments = dotTopicRespComments.as_model(dotTopicRespCommentsJson)
    dotTopicRespComments.update()
    return dotTopicRespComments


def findById(id):
    return DotTopicRespComments.query.get(id)


def findAll(page, per_page, sort_column):
    return DotTopicRespComments.query.order_by(getSort(sort_column)).paginate(page, per_page, error_out=False)


def findBy(**kwargs):
    condition_arr = []
    for col, val in kwargs.items():
        condition_arr.append(getattr(DotTopicRespComments, col).__eq__(f'{val}%'))
    condition = or_(*condition_arr)
    return DotTopicRespComments.query.filter(condition).all()


def importDotTopicRespCommentss(dotTopicRespCommentssJson):
    modelList = []
    for i in dotTopicRespCommentssJson:
        dotTopicRespComments = DotTopicRespComments()
        dotTopicRespComments = dotTopicRespComments.as_model(i)
        modelList.append(dotTopicRespComments)
    dotTopicRespComments = DotTopicRespComments()
    dotTopicRespComments.saveAll(modelList)


def deleteById(id):
    dotTopicRespComments = findById(id)
    dotTopicRespComments.delete()
