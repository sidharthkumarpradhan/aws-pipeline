from website.model_dir.dot_tags import DotTags
from website.utils_dir.common_utils import getSort
from sqlalchemy import or_


def createDotTags(dotTagsJson):
    dotTags = DotTags()
    dotTags = dotTags.as_model(dotTagsJson)
    dotTags.save()
    return dotTags


def updateDotTags(dotTagsJson):
    dotTags = DotTags()
    dotTags = dotTags.as_model(dotTagsJson)
    dotTags.update()
    return dotTags


def findById(id):
    return DotTags.query.get(id)


def findAll(page, per_page, sort_column):
    return DotTags.query.order_by(getSort(sort_column)).paginate(page, per_page, error_out=False)


def findBy(**kwargs):
    condition_arr = []
    for col, val in kwargs.items():
        condition_arr.append(getattr(DotTags, col).ilike(f'{val}%'))
    condition = or_(*condition_arr)
    return DotTags.query.filter(condition).all()


def importDotTagss(dotTagssJson):
    modelList = []
    for i in dotTagssJson:
        dotTags = DotTags()
        dotTags = dotTags.as_model(i)
        modelList.append(dotTags)
    dotTags = DotTags()
    dotTags.saveAll(modelList)


def deleteById(id):
    dotTags = findById(id)
    dotTags.delete()
