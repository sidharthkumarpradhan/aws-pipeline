from flask import Blueprint, request
from flask import jsonify
from website.service_dir.dot_topic_group_roles_service import createDotTopicGroupRoles, updateDotTopicGroupRoles
from website.service_dir.dot_topic_group_roles_service import findAll, findById, findBy, groupMembers, dotRejectOtherInvites
from website.service_dir.dot_topic_group_roles_service import importDotTopicGroupRoless, deleteById, topicRoles
from website.oauth2 import require_oauth
from website.model_dir.dot_topic_group_roles import DotTopicGroupRoles
from json import loads
import pandas as pd

bp = Blueprint(__name__, 'dotTopicGroupRoles')


@bp.route('', methods=['POST', 'PUT', 'GET'])
@require_oauth()
def dotTopicGroupRolesOps():
    dotTopicGroupRolesObj = DotTopicGroupRoles()
    if request.method == 'POST':
        dotTopicGroupRoles = request.get_json(force=True)
        dotTopicGroupRolesObj = createDotTopicGroupRoles(dotTopicGroupRoles)
        #dotRejectOtherInvites(dotTopicGroupRoles['topic_id'], dotTopicGroupRoles['group'])

    elif request.method == 'PUT':
        dotTopicGroupRoles = request.get_json(force=True)
        dotTopicGroupRolesObj = updateDotTopicGroupRoles(dotTopicGroupRoles)

    elif request.method == 'GET':
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        sort = request.args.get('sort', 'lastmodified_date,desc', type=str)
        dotTopicGroupRolesPages = findAll(page, per_page, sort)
        dotTopicGroupRoless = dotTopicGroupRolesPages.items
        dotTopicGroupRolesMaps = []
        for dotTopicGroupRoles in dotTopicGroupRoless:
            dotTopicGroupRolesMaps.append(dotTopicGroupRoles.as_dict())

        return jsonify(dotTopicGroupRolesMaps), 200, {'X-Total-Count': dotTopicGroupRolesPages.total}
    return jsonify(dotTopicGroupRolesObj.as_dict())


@bp.route('/<id>',  methods=['GET'])
@require_oauth()
def findbyId(id):
    dotTopicGroupRoles = findById(id)
    return jsonify(dotTopicGroupRoles.as_dict())


@bp.route('/filter',  methods=['POST'])
@require_oauth()
def findbyFilter():
    filterDict = request.get_json(force=True)
    dotTopicGroupRoless = findBy(**filterDict)
    dotTopicGroupRolesMaps = []
    for dotTopicGroupRoles in dotTopicGroupRoless:
        dotTopicGroupRolesMaps.append(dotTopicGroupRoles.as_dict())
    return jsonify(dotTopicGroupRolesMaps), 200, {'X-Total-Count': len(dotTopicGroupRoless)}


@bp.route('/import',  methods=['POST'])
@require_oauth()
def importDotTopicGroupRolessRoute():
    csv_file = pd.DataFrame(pd.read_csv(request.files.get('file'),skiprows=1, sep=",", names=["email", "language", "location", "mobile", "name"], index_col=False))
    result = csv_file.to_json(orient="records")
    parsed = loads(result)
    importDotTopicGroupRoless(parsed)
    return jsonify({"success": True})


@bp.route('/<id>',  methods=['DELETE'])
@require_oauth()
def deletebyId(id):
    deleteById(id)
    return jsonify({"success": True})


@bp.route('/topic_roles',  methods=['POST'])
@require_oauth()
def topic_roles():
    filterDict = request.get_json(force=True)
    dotTopicRoless = topicRoles(filterDict)
    dotTopicRolesMap = []
    for dotTopicRole in dotTopicRoless:
        dotTopicRolesMap.append({"role_id": dotTopicRole.role_id,
                                 "role_img": dotTopicRole.role_img,
                                 "role_name": dotTopicRole.role_name,
                                 "topic_id": dotTopicRole.topic_id,
                                 "group_id": dotTopicRole.group_id,
                                 "group_role_id": dotTopicRole.group_role_id,
                                 "role_assigned_to": dotTopicRole.role_assigned_to,
                                 "user_id": dotTopicRole.user_id,
                                 "display_name": dotTopicRole.display_name,
                                 "avatar_image_file": dotTopicRole.avatar_image_file
                                 })
    return jsonify(dotTopicRolesMap)


@bp.route('/group_members',  methods=['POST'])
@require_oauth()
def group_members():
    filterDict = request.get_json(force=True)
    dotGroupMembersMap = groupMembers(filterDict["group_id"])
    return jsonify(dotGroupMembersMap)


@bp.route('/delete_assignments',  methods=['GET'])
@require_oauth()
def delete_assignments():
    dotGroupMembersMap = dotRejectOtherInvites(106, 100)
    return jsonify({"success":"success"})
