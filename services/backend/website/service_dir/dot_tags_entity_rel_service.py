from website.model_dir.dot_tags_entity_rel import DotTagsEntityRel
from website.utils_dir.common_utils import getSort
from sqlalchemy import or_


def createDotTagsEntityRel(dotTagsEntityRelJson):
    dotTagsEntityRel = DotTagsEntityRel()
    dotTagsEntityRel = dotTagsEntityRel.as_model(dotTagsEntityRelJson)
    dotTagsEntityRel.save()
    return dotTagsEntityRel


def updateDotTagsEntityRel(dotTagsEntityRelJson):
    dotTagsEntityRel = DotTagsEntityRel()
    dotTagsEntityRel = dotTagsEntityRel.as_model(dotTagsEntityRelJson)
    dotTagsEntityRel.update()
    return dotTagsEntityRel


def findById(id):
    return DotTagsEntityRel.query.get(id)


def findAll(page, per_page, sort_column):
    return DotTagsEntityRel.query.order_by(getSort(sort_column)).paginate(page, per_page, error_out=False)


def findBy(**kwargs):
    condition_arr = []
    for col, val in kwargs.items():
        condition_arr.append(getattr(DotTagsEntityRel, col).ilike(f'{val}%'))
    condition = or_(*condition_arr)
    return DotTagsEntityRel.query.filter(condition).all()


def importDotTagsEntityRels(dotTagsEntityRelsJson):
    modelList = []
    for i in dotTagsEntityRelsJson:
        dotTagsEntityRel = DotTagsEntityRel()
        dotTagsEntityRel = dotTagsEntityRel.as_model(i)
        modelList.append(dotTagsEntityRel)
    dotTagsEntityRel = DotTagsEntityRel()
    dotTagsEntityRel.saveAll(modelList)


def deleteById(id):
    dotTagsEntityRel = findById(id)
    dotTagsEntityRel.delete()
