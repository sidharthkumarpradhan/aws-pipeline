from flask import Blueprint, request
from flask import jsonify
from website.service_dir.dot_group_responses_service import createDotGroupResponses, updateDotGroupResponses
from website.service_dir.dot_group_responses_service import findAll, findById, findBy
from website.service_dir.dot_group_responses_service import importDotGroupResponsess, deleteById
from website.oauth2 import require_oauth
from website.model_dir.dot_group_responses import DotGroupResponses
from json import loads
import pandas as pd

bp = Blueprint(__name__, 'dotGroupResponses')


@bp.route('', methods=['POST', 'PUT', 'GET'])
@require_oauth()
def dotGroupResponsesOps():
    dotGroupResponsesObj = DotGroupResponses()
    if request.method == 'POST':
        dotGroupResponses = request.get_json(force=True)
        dotGroupResponsesObj = createDotGroupResponses(dotGroupResponses)

    elif request.method == 'PUT':
        dotGroupResponses = request.get_json(force=True)
        dotGroupResponsesObj = updateDotGroupResponses(dotGroupResponses)

    elif request.method == 'GET':
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        sort = request.args.get('sort', 'lastmodified_date,desc', type=str)
        dotGroupResponsesPages = findAll(page, per_page, sort)
        dotGroupResponsess = dotGroupResponsesPages.items
        dotGroupResponsesMaps = []
        for dotGroupResponses in dotGroupResponsess:
            dotGroupResponsesMaps.append(dotGroupResponses.as_dict())

        return jsonify(dotGroupResponsesMaps), 200, {'X-Total-Count': dotGroupResponsesPages.total}
    return jsonify(dotGroupResponsesObj.as_dict())


@bp.route('/<id>',  methods=['GET'])
@require_oauth()
def findbyId(id):
    dotGroupResponses = findById(id)
    return jsonify(dotGroupResponses.as_dict())


@bp.route('/filter',  methods=['POST'])
@require_oauth()
def findbyFilter():
    filterDict = request.get_json(force=True)
    dotGroupResponsess = findBy(**filterDict)
    dotGroupResponsesMaps = []
    for dotGroupResponses in dotGroupResponsess:
        dotGroupResponsesMaps.append(dotGroupResponses.as_dict())
    return jsonify(dotGroupResponsesMaps), 200, {'X-Total-Count': len(dotGroupResponsess)}


@bp.route('/import',  methods=['POST'])
@require_oauth()
def importDotGroupResponsessRoute():
    csv_file = pd.DataFrame(pd.read_csv(request.files.get('file'),skiprows=1, sep=",", names=["email", "language", "location", "mobile", "name"], index_col=False))
    result = csv_file.to_json(orient="records")
    parsed = loads(result)
    importDotGroupResponsess(parsed)
    return jsonify({"success": True})


@bp.route('/<id>',  methods=['DELETE'])
@require_oauth()
def deletebyId(id):
    deleteById(id)
    return jsonify({"success": True})
