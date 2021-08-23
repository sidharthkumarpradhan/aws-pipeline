from website.model_dir.dot_topic_ratings import DotTopicRatings
from website.utils_dir.common_utils import getSort
from sqlalchemy import or_


def createDotTopicRatings(dotTopicRatingsJson):
    dotTopicRatings = DotTopicRatings()
    dotTopicRatings = dotTopicRatings.as_model(dotTopicRatingsJson)
    dotTopicRatings.save()
    return dotTopicRatings


def updateDotTopicRatings(dotTopicRatingsJson):
    dotTopicRatings = DotTopicRatings()
    dotTopicRatings = dotTopicRatings.as_model(dotTopicRatingsJson)
    dotTopicRatings.update()
    return dotTopicRatings


def findById(id):
    return DotTopicRatings.query.get(id)


def findAll(page, per_page, sort_column):
    return DotTopicRatings.query.order_by(getSort(sort_column)).paginate(page, per_page, error_out=False)


def findBy(**kwargs):
    condition_arr = []
    for col, val in kwargs.items():
        condition_arr.append(getattr(DotTopicRatings, col).ilike(f'{val}%'))
    condition = or_(*condition_arr)
    return DotTopicRatings.query.filter(condition).all()


def importDotTopicRatingss(dotTopicRatingssJson):
    modelList = []
    for i in dotTopicRatingssJson:
        dotTopicRatings = DotTopicRatings()
        dotTopicRatings = dotTopicRatings.as_model(i)
        modelList.append(dotTopicRatings)
    dotTopicRatings = DotTopicRatings()
    dotTopicRatings.saveAll(modelList)


def deleteById(id):
    dotTopicRatings = findById(id)
    dotTopicRatings.delete()
