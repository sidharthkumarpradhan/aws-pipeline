from flask import Blueprint, request
from flask import jsonify
from website.service_dir.dot_topic_create_request_service import createDotTopicCreateRequest, updateDotTopicCreateRequest
from website.service_dir.dot_topic_create_request_service import findAll, findById, findBy
from website.service_dir.dot_topic_create_request_service import importDotTopicCreateRequests, deleteById
from website.oauth2 import require_oauth
from website.model_dir.dot_topic_create_request import DotTopicCreateRequest
from json import loads
import pandas as pd

bp = Blueprint(__name__, 'dotTopicCreateRequest')


@bp.route('', methods=['POST', 'PUT', 'GET'])
@require_oauth()
def dotTopicCreateRequestOps():
    dotTopicCreateRequestObj = DotTopicCreateRequest()
    if request.method == 'POST':
        dotTopicCreateRequest = request.get_json(force=True)
        dotTopicCreateRequestObj = createDotTopicCreateRequest(dotTopicCreateRequest)

    elif request.method == 'PUT':
        dotTopicCreateRequest = request.get_json(force=True)
        dotTopicCreateRequestObj = updateDotTopicCreateRequest(dotTopicCreateRequest)

    elif request.method == 'GET':
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        sort = request.args.get('sort', 'lastmodified_date,desc', type=str)
        dotTopicCreateRequestPages = findAll(page, per_page, sort)
        dotTopicCreateRequests = dotTopicCreateRequestPages.items
        dotTopicCreateRequestMaps = []
        for dotTopicCreateRequest in dotTopicCreateRequests:
            dotTopicCreateRequestMaps.append(dotTopicCreateRequest.as_dict())

        return jsonify(dotTopicCreateRequestMaps), 200, {'X-Total-Count': dotTopicCreateRequestPages.total}
    return jsonify(dotTopicCreateRequestObj.as_dict())


@bp.route('/<id>',  methods=['GET'])
@require_oauth()
def findbyId(id):
    dotTopicCreateRequest = findById(id)
    return jsonify(dotTopicCreateRequest.as_dict())


@bp.route('/filter',  methods=['POST'])
@require_oauth()
def findbyFilter():
    filterDict = request.get_json(force=True)
    dotTopicCreateRequests = findBy(**filterDict)
    dotTopicCreateRequestMaps = []
    for dotTopicCreateRequest in dotTopicCreateRequests:
        dotTopicCreateRequestMaps.append(dotTopicCreateRequest.as_dict())
    return jsonify(dotTopicCreateRequestMaps), 200, {'X-Total-Count': len(dotTopicCreateRequests)}


@bp.route('/import',  methods=['POST'])
@require_oauth()
def importDotTopicCreateRequestsRoute():
    csv_file = pd.DataFrame(pd.read_csv(request.files.get('file'),skiprows=1, sep=",", names=["email", "language", "location", "mobile", "name"], index_col=False))
    result = csv_file.to_json(orient="records")
    parsed = loads(result)
    importDotTopicCreateRequests(parsed)
    return jsonify({"success": True})


@bp.route('/<id>',  methods=['DELETE'])
@require_oauth()
def deletebyId(id):
    deleteById(id)
    return jsonify({"success": True})
