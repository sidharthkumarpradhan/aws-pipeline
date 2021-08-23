from website.model_dir.dot_topic_resp_attachments import DotTopicRespAttachments
from website.utils_dir.common_utils import getSort
from sqlalchemy import or_


def createDotTopicRespAttachments(dotTopicRespAttachmentsJson):
    dotTopicRespAttachments = DotTopicRespAttachments()
    dotTopicRespAttachments = dotTopicRespAttachments.as_model(dotTopicRespAttachmentsJson)
    dotTopicRespAttachments.save()
    return dotTopicRespAttachments


def updateDotTopicRespAttachments(dotTopicRespAttachmentsJson):
    dotTopicRespAttachments = DotTopicRespAttachments()
    dotTopicRespAttachments = dotTopicRespAttachments.as_model(dotTopicRespAttachmentsJson)
    dotTopicRespAttachments.update()
    return dotTopicRespAttachments


def findById(id):
    return DotTopicRespAttachments.query.get(id)


def findAll(page, per_page, sort_column):
    return DotTopicRespAttachments.query.order_by(getSort(sort_column)).paginate(page, per_page, error_out=False)


def findBy(**kwargs):
    condition_arr = []
    for col, val in kwargs.items():
        condition_arr.append(getattr(DotTopicRespAttachments, col).ilike(f'{val}%'))
    condition = or_(*condition_arr)
    return DotTopicRespAttachments.query.filter(condition).all()


def importDotTopicRespAttachmentss(dotTopicRespAttachmentssJson):
    modelList = []
    for i in dotTopicRespAttachmentssJson:
        dotTopicRespAttachments = DotTopicRespAttachments()
        dotTopicRespAttachments = dotTopicRespAttachments.as_model(i)
        modelList.append(dotTopicRespAttachments)
    dotTopicRespAttachments = DotTopicRespAttachments()
    dotTopicRespAttachments.saveAll(modelList)


def deleteById(id):
    dotTopicRespAttachments = findById(id)
    dotTopicRespAttachments.delete()
