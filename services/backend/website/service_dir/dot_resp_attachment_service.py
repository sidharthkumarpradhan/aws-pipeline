from website.model_dir.dot_resp_attachment import DotRespAttachment
from website.utils_dir.common_utils import getSort
from sqlalchemy import or_


def createDotRespAttachment(dotRespAttachmentJson):
    dotRespAttachment = DotRespAttachment()
    dotRespAttachment = dotRespAttachment.as_model(dotRespAttachmentJson)
    dotRespAttachment.save()
    return dotRespAttachment


def updateDotRespAttachment(dotRespAttachmentJson):
    dotRespAttachment = DotRespAttachment()
    dotRespAttachment = dotRespAttachment.as_model(dotRespAttachmentJson)
    dotRespAttachment.update()
    return dotRespAttachment


def findById(id):
    return DotRespAttachment.query.get(id)


def findAll(page, per_page, sort_column):
    return DotRespAttachment.query.order_by(getSort(sort_column)).paginate(page, per_page, error_out=False)


def findBy(**kwargs):
    condition_arr = []
    for col, val in kwargs.items():
        condition_arr.append(getattr(DotRespAttachment, col).ilike(f'{val}%'))
    condition = or_(*condition_arr)
    return DotRespAttachment.query.filter(condition).all()


def importDotRespAttachments(dotRespAttachmentsJson):
    modelList = []
    for i in dotRespAttachmentsJson:
        dotRespAttachment = DotRespAttachment()
        dotRespAttachment = dotRespAttachment.as_model(i)
        modelList.append(dotRespAttachment)
    dotRespAttachment = DotRespAttachment()
    dotRespAttachment.saveAll(modelList)


def deleteById(id):
    dotRespAttachment = findById(id)
    dotRespAttachment.delete()
