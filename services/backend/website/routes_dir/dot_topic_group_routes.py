from flask import Blueprint, request
from flask import jsonify
from website.service_dir.dot_topic_group_service import createDotTopicGroup, updateDotTopicGroup, autoAssign
from website.service_dir.dot_topic_group_service import findAll, findById, findBy
from website.service_dir.dot_topic_group_service import importDotTopicGroups, deleteById, checkGroupName
from website.service_dir.dot_topic_group_service import createChallengeGroup, updateChallengeGroup, autoAssign
from website.oauth2 import require_oauth
from website.model_dir.dot_topic_group import DotTopicGroup
from json import loads
import pandas as pd

bp = Blueprint(__name__, 'dotTopicGroup')


@bp.route('', methods=['POST', 'PUT', 'GET'])
@require_oauth()
def dotTopicGroupOps():
    dotTopicGroupObj = DotTopicGroup()
    if request.method == 'POST':
        dotTopicGroup = request.get_json(force=True)
        dotTopicGroupObj = createDotTopicGroup(dotTopicGroup)

    elif request.method == 'PUT':
        dotTopicGroup = request.get_json(force=True)
        dotTopicGroupObj = updateDotTopicGroup(dotTopicGroup)

    elif request.method == 'GET':
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        sort = request.args.get('sort', 'lastmodified_date,desc', type=str)
        dotTopicGroupPages = findAll(page, per_page, sort)
        dotTopicGroups = dotTopicGroupPages.items
        dotTopicGroupMaps = []
        for dotTopicGroup in dotTopicGroups:
            dotTopicGroupMaps.append(dotTopicGroup.as_dict())

        return jsonify(dotTopicGroupMaps), 200, {'X-Total-Count': dotTopicGroupPages.total}
    return jsonify(dotTopicGroupObj.as_dict())


@bp.route('/<id>',  methods=['GET'])
@require_oauth()
def findbyId(id):
    dotTopicGroup = findById(id)
    return jsonify(dotTopicGroup.as_dict())


@bp.route('/filter',  methods=['POST'])
@require_oauth()
def findbyFilter():
    filterDict = request.get_json(force=True)
    dotTopicGroups = findBy(**filterDict)
    dotTopicGroupMaps = []
    for dotTopicGroup in dotTopicGroups:
        dotTopicGroupMaps.append(dotTopicGroup.as_dict())
    return jsonify(dotTopicGroupMaps), 200, {'X-Total-Count': len(dotTopicGroups)}


@bp.route('/import',  methods=['POST'])
@require_oauth()
def importDotTopicGroupsRoute():
    csv_file = pd.DataFrame(pd.read_csv(request.files.get('file'),skiprows=1, sep=",", names=["email", "language", "location", "mobile", "name"], index_col=False))
    result = csv_file.to_json(orient="records")
    parsed = loads(result)
    importDotTopicGroups(parsed)
    return jsonify({"success": True})


@bp.route('/<id>',  methods=['DELETE'])
@require_oauth()
def deletebyId(id):
    deleteById(id)
    return jsonify({"success": True})


@bp.route('/check_groupname',  methods=['POST'])
@require_oauth()
def check_groupname():
    dotTopicGroups = request.get_json(force=True)
    returnVal = checkGroupName(dotTopicGroups)
    return jsonify({"success": returnVal})


@bp.route('/create_challenge_group',  methods=['POST'])
@require_oauth()
def createChallenge():
    dotTopicGroups = request.get_json(force=True)
    dotChallengeGroupObj = createChallengeGroup(dotTopicGroups)
    return jsonify(dotChallengeGroupObj)


@bp.route('/update_challenge_group',  methods=['PUT'])
@require_oauth()
def updateChallenge():
    dotTopicGroups = request.get_json(force=True)
    dotChallengeGroupObj = updateChallengeGroup(dotTopicGroups)
    return jsonify(dotChallengeGroupObj.as_dict())


@bp.route('/auto_assign',  methods=['POST'])
@require_oauth()
def auto_assign():
    dotGroupJson = request.get_json(force=True)
    dotTopicAssignmentss = autoAssign(dotGroupJson)
    dotTopicAssignmentsMap = []
    for dotTopicAssignment in dotTopicAssignmentss:
            dotTopicAssignmentsMap.append({
                "user_id": dotTopicAssignment.user_id,
                "user_email": dotTopicAssignment.user_email,
                "display_name": dotTopicAssignment.display_name,
                "avatar_image_file": dotTopicAssignment.avatar_image_file,
            })
    return jsonify(dotTopicAssignmentsMap)
