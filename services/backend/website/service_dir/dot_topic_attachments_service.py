from website.model_dir.dot_topic_attachments import DotTopicAttachments
from website.utils_dir.common_utils import getSort
from sqlalchemy import or_


def createDotTopicAttachments(dotTopicAttachmentsJson):
    dotTopicAttachments = DotTopicAttachments()
    dotTopicAttachments = dotTopicAttachments.as_model(dotTopicAttachmentsJson)
    dotTopicAttachments.save()
    return dotTopicAttachments


def updateDotTopicAttachments(dotTopicAttachmentsJson):
    dotTopicAttachments = DotTopicAttachments()
    dotTopicAttachments = dotTopicAttachments.as_model(dotTopicAttachmentsJson)
    dotTopicAttachments.update()
    return dotTopicAttachments


def findById(id):
    return DotTopicAttachments.query.get(id)


def findAll(page, per_page, sort_column):
    return DotTopicAttachments.query.order_by(getSort(sort_column)).paginate(page, per_page, error_out=False)


def findBy(**kwargs):
    condition_arr = []
    for col, val in kwargs.items():
        condition_arr.append(getattr(DotTopicAttachments, col).ilike(f'{val}%'))
    condition = or_(*condition_arr)
    return DotTopicAttachments.query.filter(condition).all()


def importDotTopicAttachmentss(dotTopicAttachmentssJson):
    modelList = []
    for i in dotTopicAttachmentssJson:
        dotTopicAttachments = DotTopicAttachments()
        dotTopicAttachments = dotTopicAttachments.as_model(i)
        modelList.append(dotTopicAttachments)
    dotTopicAttachments = DotTopicAttachments()
    dotTopicAttachments.saveAll(modelList)


def deleteById(id):
    dotTopicAttachments = findById(id)
    dotTopicAttachments.delete()
