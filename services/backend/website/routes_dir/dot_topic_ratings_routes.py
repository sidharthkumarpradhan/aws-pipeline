from flask import Blueprint, request
from flask import jsonify
from website.service_dir.dot_topic_ratings_service import createDotTopicRatings, updateDotTopicRatings
from website.service_dir.dot_topic_ratings_service import findAll, findById, findBy
from website.service_dir.dot_topic_ratings_service import importDotTopicRatingss, deleteById
from website.oauth2 import require_oauth
from website.model_dir.dot_topic_ratings import DotTopicRatings
from json import loads
import pandas as pd

bp = Blueprint(__name__, 'dotTopicRatings')


@bp.route('', methods=['POST', 'PUT', 'GET'])
@require_oauth()
def dotTopicRatingsOps():
    dotTopicRatingsObj = DotTopicRatings()
    if request.method == 'POST':
        dotTopicRatings = request.get_json(force=True)
        dotTopicRatingsObj = createDotTopicRatings(dotTopicRatings)

    elif request.method == 'PUT':
        dotTopicRatings = request.get_json(force=True)
        dotTopicRatingsObj = updateDotTopicRatings(dotTopicRatings)

    elif request.method == 'GET':
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        sort = request.args.get('sort', 'lastmodified_date,desc', type=str)
        dotTopicRatingsPages = findAll(page, per_page, sort)
        dotTopicRatingss = dotTopicRatingsPages.items
        dotTopicRatingsMaps = []
        for dotTopicRatings in dotTopicRatingss:
            dotTopicRatingsMaps.append(dotTopicRatings.as_dict())

        return jsonify(dotTopicRatingsMaps), 200, {'X-Total-Count': dotTopicRatingsPages.total}
    return jsonify(dotTopicRatingsObj.as_dict())


@bp.route('/<id>',  methods=['GET'])
@require_oauth()
def findbyId(id):
    dotTopicRatings = findById(id)
    return jsonify(dotTopicRatings.as_dict())


@bp.route('/filter',  methods=['POST'])
@require_oauth()
def findbyFilter():
    filterDict = request.get_json(force=True)
    dotTopicRatingss = findBy(**filterDict)
    dotTopicRatingsMaps = []
    for dotTopicRatings in dotTopicRatingss:
        dotTopicRatingsMaps.append(dotTopicRatings.as_dict())
    return jsonify(dotTopicRatingsMaps), 200, {'X-Total-Count': len(dotTopicRatingss)}


@bp.route('/import',  methods=['POST'])
@require_oauth()
def importDotTopicRatingssRoute():
    csv_file = pd.DataFrame(pd.read_csv(request.files.get('file'),skiprows=1, sep=",", names=["email", "language", "location", "mobile", "name"], index_col=False))
    result = csv_file.to_json(orient="records")
    parsed = loads(result)
    importDotTopicRatingss(parsed)
    return jsonify({"success": True})


@bp.route('/<id>',  methods=['DELETE'])
@require_oauth()
def deletebyId(id):
    deleteById(id)
    return jsonify({"success": True})
