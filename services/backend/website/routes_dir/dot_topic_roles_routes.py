from flask import Blueprint, request
from flask import jsonify
from website.service_dir.dot_topic_roles_service import createDotTopicRoles, updateDotTopicRoles
from website.service_dir.dot_topic_roles_service import findAll, findById, findBy
from website.service_dir.dot_topic_roles_service import importDotTopicRoless, deleteById
from website.oauth2 import require_oauth
from website.model_dir.dot_topic_roles import DotTopicRoles
from json import loads
import pandas as pd

bp = Blueprint(__name__, 'dotTopicRoles')


@bp.route('', methods=['POST', 'PUT', 'GET'])
@require_oauth()
def dotTopicRolesOps():
    dotTopicRolesObj = DotTopicRoles()
    if request.method == 'POST':
        dotTopicRoles = request.get_json(force=True)
        dotTopicRolesObj = createDotTopicRoles(dotTopicRoles)

    elif request.method == 'PUT':
        dotTopicRoles = request.get_json(force=True)
        dotTopicRolesObj = updateDotTopicRoles(dotTopicRoles)

    elif request.method == 'GET':
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        sort = request.args.get('sort', 'lastmodified_date,desc', type=str)
        dotTopicRolesPages = findAll(page, per_page, sort)
        dotTopicRoless = dotTopicRolesPages.items
        dotTopicRolesMaps = []
        for dotTopicRoles in dotTopicRoless:
            dotTopicRolesMaps.append(dotTopicRoles.as_dict())

        return jsonify(dotTopicRolesMaps), 200, {'X-Total-Count': dotTopicRolesPages.total}
    return jsonify(dotTopicRolesObj.as_dict())


@bp.route('/<id>',  methods=['GET'])
@require_oauth()
def findbyId(id):
    dotTopicRoles = findById(id)
    return jsonify(dotTopicRoles.as_dict())


@bp.route('/filter',  methods=['POST'])
@require_oauth()
def findbyFilter():
    filterDict = request.get_json(force=True)
    dotTopicRoless = findBy(**filterDict)
    dotTopicRolesMaps = []
    for dotTopicRoles in dotTopicRoless:
        dotTopicRolesMaps.append(dotTopicRoles.as_dict())
    return jsonify(dotTopicRolesMaps), 200, {'X-Total-Count': len(dotTopicRoless)}


@bp.route('/import',  methods=['POST'])
@require_oauth()
def importDotTopicRolessRoute():
    csv_file = pd.DataFrame(pd.read_csv(request.files.get('file'),skiprows=1, sep=",", names=["email", "language", "location", "mobile", "name"], index_col=False))
    result = csv_file.to_json(orient="records")
    parsed = loads(result)
    importDotTopicRoless(parsed)
    return jsonify({"success": True})


@bp.route('/<id>',  methods=['DELETE'])
@require_oauth()
def deletebyId(id):
    deleteById(id)
    return jsonify({"success": True})
