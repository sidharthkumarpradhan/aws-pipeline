from website.model_dir.dot_skill_details import DotSkillDetails
from website.utils_dir.common_utils import getSort
from sqlalchemy import or_


def createDotSkillDetails(dotSkillDetailsJson):
    dotSkillDetails = DotSkillDetails()
    dotSkillDetails = dotSkillDetails.as_model(dotSkillDetailsJson)
    dotSkillDetails.save()
    return dotSkillDetails


def updateDotSkillDetails(dotSkillDetailsJson):
    dotSkillDetails = DotSkillDetails()
    dotSkillDetails = dotSkillDetails.as_model(dotSkillDetailsJson)
    dotSkillDetails.update()
    return dotSkillDetails


def findById(id):
    return DotSkillDetails.query.get(id)


def findAll(page, per_page, sort_column):
    return DotSkillDetails.query.order_by(getSort(sort_column)).paginate(page, per_page, error_out=False)


def findBy(**kwargs):
    condition_arr = []
    for col, val in kwargs.items():
        condition_arr.append(getattr(DotSkillDetails, col).ilike(f'{val}%'))
    condition = or_(*condition_arr)
    return DotSkillDetails.query.filter(condition).all()


def importDotSkillDetailss(dotSkillDetailssJson):
    modelList = []
    for i in dotSkillDetailssJson:
        dotSkillDetails = DotSkillDetails()
        dotSkillDetails = dotSkillDetails.as_model(i)
        modelList.append(dotSkillDetails)
    dotSkillDetails = DotSkillDetails()
    dotSkillDetails.saveAll(modelList)


def deleteById(id):
    dotSkillDetails = findById(id)
    dotSkillDetails.delete()


def skillsByCategory(category):
    dotSkillDetails = DotSkillDetails.query.filter(DotSkillDetails.skill_category == category).all()
    return dotSkillDetails
