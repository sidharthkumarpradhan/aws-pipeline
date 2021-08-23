from website.model_dir.base_model import db
from website.model_dir.dot_topic_resp_ratings import DotTopicRespRatings
from website.utils_dir.common_utils import getSort
from sqlalchemy import or_, text
from authlib.integrations.flask_oauth2 import current_token

def createDot_topic_resp_ratings(dot_topic_resp_ratingsJson):
    dot_topic_resp_ratings = DotTopicRespRatings()
    dot_topic_resp_ratings = dot_topic_resp_ratings.as_model(dot_topic_resp_ratingsJson)
    dot_topic_resp_ratings.save()
    return dot_topic_resp_ratings


def updateDot_topic_resp_ratings(dot_topic_resp_ratingsJson):
    dot_topic_resp_ratings = DotTopicRespRatings()
    dot_topic_resp_ratings = dot_topic_resp_ratings.as_model(dot_topic_resp_ratingsJson)
    dot_topic_resp_ratings.update()
    return dot_topic_resp_ratings


def findById(id):
    return DotTopicRespRatings.query.get(id)


def findAll(page, per_page, sort_column):
    return DotTopicRespRatings.query.order_by(getSort(sort_column)).paginate(page, per_page, error_out=False)


def findBy(**kwargs):
    condition_arr = []
    for col, val in kwargs.items():
        condition_arr.append(getattr(DotTopicRespRatings, col).__eq__(f'{val}%'))
    condition = or_(*condition_arr)
    return DotTopicRespRatings.query.filter(condition).all()


def importDot_topic_resp_ratingss(dot_topic_resp_ratingssJson):
    modelList = []
    for i in dot_topic_resp_ratingssJson:
        dot_topic_resp_ratings = DotTopicRespRatings()
        dot_topic_resp_ratings = dot_topic_resp_ratings.as_model(i)
        modelList.append(dot_topic_resp_ratings)
    dot_topic_resp_ratings = DotTopicRespRatings()
    dot_topic_resp_ratings.saveAll(modelList)


def deleteById(id):
    dot_topic_resp_ratings = findById(id)
    dot_topic_resp_ratings.delete()


def filter(filterDict):
    return DotTopicRespRatings.query.filter(DotTopicRespRatings.topic_reponse == filterDict['topic_reponse']).all()


def rateResponse(dotRateResponseJson):
    topic_resp_rating_id = dotRateResponseJson['topic_resp_rating_id']
    if topic_resp_rating_id is None:
        dotRateResponseJson["user"] = current_token.user.id
        dotRateResponseJson.pop("topic_resp_rating_id")
        dotTopicRespRating = createDot_topic_resp_ratings(dotRateResponseJson)
    else:
        dotRateResponseJson["user"] = current_token.user.id
        dotTopicRespRating = updateDot_topic_resp_ratings(dotRateResponseJson)
    return dotTopicRespRating


def reactResponse(dotReactResponseJson):
    topic_resp_rating_id = dotReactResponseJson['topic_resp_rating_id']
    if topic_resp_rating_id is None:
        dotReactResponseJson["user"] = current_token.user.id
        dotReactResponseJson.pop("topic_resp_rating_id")
        dotTopicRespRating = createDot_topic_resp_ratings(dotReactResponseJson)
    else:
        dotReactResponseJson["user"] = current_token.user.id
        dotTopicRespRating = updateDot_topic_resp_ratings(dotReactResponseJson)
    return dotTopicRespRating


def respReactions(topic_response):
    t = text("""SELECT 
    SUM(CASE
        WHEN rating_reaction = 'Creative' THEN 1
        ELSE 0
    END) AS creative,
    SUM(CASE
        WHEN rating_reaction = 'Truth' THEN 1
        ELSE 0
    END) AS truth,
    SUM(CASE
        WHEN rating_reaction = 'Fun' THEN 1
        ELSE 0
    END) AS fun
FROM
    dot_topic_resp_ratings
WHERE
    topic_response_id = ':topic_response'
GROUP BY topic_response_id """).bindparams(topic_response = int(topic_response))
    dotTopicRespRating = db.session.execute(t)
    return dotTopicRespRating



