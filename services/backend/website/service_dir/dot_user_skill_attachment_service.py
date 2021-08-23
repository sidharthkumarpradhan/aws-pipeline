from website.model_dir.dot_user_skill_attachment import DotUserSkillAttachment
from website.utils_dir.common_utils import getSort
from sqlalchemy import or_


def createDotUserSkillAttachment(dotUserSkillAttachmentJson):
    dotUserSkillAttachment = DotUserSkillAttachment()
    dotUserSkillAttachment = dotUserSkillAttachment.as_model(dotUserSkillAttachmentJson)
    dotUserSkillAttachment.save()
    return dotUserSkillAttachment


def updateDotUserSkillAttachment(dotUserSkillAttachmentJson):
    dotUserSkillAttachment = DotUserSkillAttachment()
    dotUserSkillAttachment = dotUserSkillAttachment.as_model(dotUserSkillAttachmentJson)
    dotUserSkillAttachment.update()
    return dotUserSkillAttachment


def findById(id):
    return DotUserSkillAttachment.query.get(id)


def findAll(page, per_page, sort_column):
    return DotUserSkillAttachment.query.order_by(getSort(sort_column)).paginate(page, per_page, error_out=False)


def findBy(**kwargs):
    condition_arr = []
    for col, val in kwargs.items():
        condition_arr.append(getattr(DotUserSkillAttachment, col).ilike(f'{val}%'))
    condition = or_(*condition_arr)
    return DotUserSkillAttachment.query.filter(condition).all()


def importDotUserSkillAttachments(dotUserSkillAttachmentsJson):
    modelList = []
    for i in dotUserSkillAttachmentsJson:
        dotUserSkillAttachment = DotUserSkillAttachment()
        dotUserSkillAttachment = dotUserSkillAttachment.as_model(i)
        modelList.append(dotUserSkillAttachment)
    dotUserSkillAttachment = DotUserSkillAttachment()
    dotUserSkillAttachment.saveAll(modelList)


def deleteById(id):
    dotUserSkillAttachment = findById(id)
    dotUserSkillAttachment.delete()
