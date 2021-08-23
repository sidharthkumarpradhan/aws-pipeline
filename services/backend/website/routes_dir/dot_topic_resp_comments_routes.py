from flask import Blueprint, request
from flask import jsonify
from website.service_dir.dot_topic_resp_comments_service import createDotTopicRespComments, updateDotTopicRespComments
from website.service_dir.dot_topic_resp_comments_service import findAll, findById, findBy
from website.service_dir.dot_topic_resp_comments_service import importDotTopicRespCommentss, deleteById
from website.oauth2 import require_oauth
from website.model_dir.dot_topic_resp_comments import DotTopicRespComments
from json import loads
import pandas as pd

bp = Blueprint(__name__, 'dotTopicRespComments')


@bp.route('', methods=['POST', 'PUT', 'GET'])
@require_oauth()
def dotTopicRespCommentsOps():
    dotTopicRespCommentsObj = DotTopicRespComments()
    if request.method == 'POST':
        dotTopicRespComments = request.get_json(force=True)
        dotTopicRespCommentsObj = createDotTopicRespComments(dotTopicRespComments)

    elif request.method == 'PUT':
        dotTopicRespComments = request.get_json(force=True)
        dotTopicRespCommentsObj = updateDotTopicRespComments(dotTopicRespComments)

    elif request.method == 'GET':
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        sort = request.args.get('sort', 'lastmodified_date,desc', type=str)
        dotTopicRespCommentsPages = findAll(page, per_page, sort)
        dotTopicRespCommentss = dotTopicRespCommentsPages.items
        dotTopicRespCommentsMaps = []
        for dotTopicRespComments in dotTopicRespCommentss:
            dotTopicRespCommentsMaps.append(dotTopicRespComments.as_dict())

        return jsonify(dotTopicRespCommentsMaps), 200, {'X-Total-Count': dotTopicRespCommentsPages.total}
    return jsonify(dotTopicRespCommentsObj.as_dict())


@bp.route('/<id>',  methods=['GET'])
@require_oauth()
def findbyId(id):
    dotTopicRespComments = findById(id)
    return jsonify(dotTopicRespComments.as_dict())


@bp.route('/filter',  methods=['POST'])
@require_oauth()
def findbyFilter():
    filterDict = request.get_json(force=True)
    dotTopicRespCommentss = findBy(**filterDict)
    dotTopicRespCommentsMaps = []
    for dotTopicRespComments in dotTopicRespCommentss:
        dotTopicRespCommentsMaps.append(dotTopicRespComments.as_dict())
    return jsonify(dotTopicRespCommentsMaps), 200, {'X-Total-Count': len(dotTopicRespCommentss)}


@bp.route('/import',  methods=['POST'])
@require_oauth()
def importDotTopicRespCommentssRoute():
    csv_file = pd.DataFrame(pd.read_csv(request.files.get('file'),skiprows=1, sep=",", names=["email", "language", "location", "mobile", "name"], index_col=False))
    result = csv_file.to_json(orient="records")
    parsed = loads(result)
    importDotTopicRespCommentss(parsed)
    return jsonify({"success": True})


@bp.route('/<id>',  methods=['DELETE'])
@require_oauth()
def deletebyId(id):
    deleteById(id)
    return jsonify({"success": True})
