from flask import Blueprint, request
from flask import jsonify
from website.service_dir.dot_topic_resp_ratings_service import createDot_topic_resp_ratings, updateDot_topic_resp_ratings
from website.service_dir.dot_topic_resp_ratings_service import findAll, findById, findBy
from website.service_dir.dot_topic_resp_ratings_service import rateResponse, reactResponse, respReactions
from website.service_dir.dot_topic_resp_ratings_service import importDot_topic_resp_ratingss, deleteById, filter
from website.oauth2 import require_oauth
from website.model_dir.dot_topic_resp_ratings import DotTopicRespRatings
from json import loads
import pandas as pd

bp = Blueprint(__name__, 'dotTopicRespRatings')


@bp.route('', methods=['POST', 'PUT', 'GET'])
@require_oauth()
def dot_topic_resp_ratingsOps():
    dot_topic_resp_ratingsObj = DotTopicRespRatings()
    if request.method == 'POST':
        dot_topic_resp_ratings = request.get_json(force=True)
        dot_topic_resp_ratingsObj = createDot_topic_resp_ratings(dot_topic_resp_ratings)

    elif request.method == 'PUT':
        dot_topic_resp_ratings = request.get_json(force=True)
        dot_topic_resp_ratingsObj = updateDot_topic_resp_ratings(dot_topic_resp_ratings)

    elif request.method == 'GET':
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        sort = request.args.get('sort', 'lastmodified_date,desc', type=str)
        dot_topic_resp_ratingsPages = findAll(page, per_page, sort)
        dot_topic_resp_ratingss = dot_topic_resp_ratingsPages.items
        dot_topic_resp_ratingsMaps = []
        for dot_topic_resp_ratings in dot_topic_resp_ratingss:
            dot_topic_resp_ratingsMaps.append(dot_topic_resp_ratings.as_dict())

        return jsonify(dot_topic_resp_ratingsMaps), 200, {'X-Total-Count': dot_topic_resp_ratingsPages.total}
    return jsonify(dot_topic_resp_ratingsObj.as_dict())


@bp.route('/<id>',  methods=['GET'])
@require_oauth()
def findbyId(id):
    dot_topic_resp_ratings = findById(id)
    return jsonify(dot_topic_resp_ratings.as_dict())


@bp.route('/filter',  methods=['POST'])
@require_oauth()
def findbyFilter():
    filterDict = request.get_json(force=True)
    dot_topic_resp_ratingss = filter(filterDict)
    dot_topic_resp_ratingsMaps = []
    for dot_topic_resp_ratings in dot_topic_resp_ratingss:
        dot_topic_resp_ratingsMaps.append(dot_topic_resp_ratings.as_dict())
    return jsonify(dot_topic_resp_ratingsMaps), 200, {'X-Total-Count': len(dot_topic_resp_ratingss)}


@bp.route('/import',  methods=['POST'])
@require_oauth()
def importDot_topic_resp_ratingssRoute():
    csv_file = pd.DataFrame(pd.read_csv(request.files.get('file'),skiprows=1, sep=",", names=["email", "language", "location", "mobile", "name"], index_col=False))
    result = csv_file.to_json(orient="records")
    parsed = loads(result)
    importDot_topic_resp_ratingss(parsed)
    return jsonify({"success": True})


@bp.route('/<id>',  methods=['DELETE'])
@require_oauth()
def deletebyId(id):
    deleteById(id)
    return jsonify({"success": True})


@bp.route('/rate_response',  methods=['POST'])
@require_oauth()
def rate_response():
    dotRateResponseJson = request.get_json(force=True)
    dotTopicRespRating = rateResponse(dotRateResponseJson)
    return jsonify(dotTopicRespRating.as_dict())


@bp.route('/react_response',  methods=['POST'])
@require_oauth()
def react_response():
    dotReactResponseJson = request.get_json(force=True)
    dotTopicRespRating = reactResponse(dotReactResponseJson)
    dotRespRatings = dotTopicRespRating.as_dict()
    respReactionss = respReactions(dotReactResponseJson["topic_response"])
    respReactionMaps = []
    for respReaction in respReactionss:
        respReactionMaps.append(
            {"creative": str(respReaction.creative), "fun": str(respReaction.fun), "truth": str(respReaction.truth)})
    dotRespRatings["reactions"] = respReactionMaps
    return jsonify(dotRespRatings)