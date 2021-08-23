from flask import Blueprint, request
from flask import jsonify
from website.service_dir.dot_topic_assignments_service import createDotTopicAssignments, updateDotTopicAssignments
from website.service_dir.dot_topic_assignments_service import findAll, findById, findBy, buddySearch
from website.service_dir.dot_topic_assignments_service import importDotTopicAssignmentss, deleteById
from website.oauth2 import require_oauth
from website.model_dir.dot_topic_assignments import DotTopicAssignments
from json import loads
import pandas as pd

from website.utils_dir.common_utils import decrypt_message

bp = Blueprint(__name__, 'dotTopicAssignments')


@bp.route('', methods=['POST', 'PUT', 'GET'])
@require_oauth()
def dotTopicAssignmentsOps():
    dotTopicAssignmentsObj = DotTopicAssignments()
    if request.method == 'POST':
        dotTopicAssignments = request.get_json(force=True)
        dotTopicAssignmentsObj = createDotTopicAssignments(dotTopicAssignments)

    elif request.method == 'PUT':
        dotTopicAssignments = request.get_json(force=True)
        dotTopicAssignmentsObj = updateDotTopicAssignments(dotTopicAssignments)

    elif request.method == 'GET':
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        sort = request.args.get('sort', 'lastmodified_date,desc', type=str)
        dotTopicAssignmentsPages = findAll(page, per_page, sort)
        dotTopicAssignmentss = dotTopicAssignmentsPages.items
        dotTopicAssignmentsMaps = []
        for dotTopicAssignments in dotTopicAssignmentss:
            dotTopicAssignmentsMaps.append(dotTopicAssignments.as_dict())

        return jsonify(dotTopicAssignmentsMaps), 200, {'X-Total-Count': dotTopicAssignmentsPages.total}
    return jsonify(dotTopicAssignmentsObj.as_dict())


@bp.route('/<id>',  methods=['GET'])
@require_oauth()
def findbyId(id):
    dotTopicAssignments = findById(id)
    return jsonify(dotTopicAssignments.as_dict())


@bp.route('/filter',  methods=['POST'])
@require_oauth()
def findbyFilter():
    filterDict = request.get_json(force=True)
    dotTopicAssignmentss = findBy(**filterDict)
    dotTopicAssignmentsMaps = []
    for dotTopicAssignments in dotTopicAssignmentss:
        dotTopicAssignmentsMaps.append(dotTopicAssignments.as_dict())
    return jsonify(dotTopicAssignmentsMaps), 200, {'X-Total-Count': len(dotTopicAssignmentss)}


@bp.route('/import',  methods=['POST'])
@require_oauth()
def importDotTopicAssignmentssRoute():
    csv_file = pd.DataFrame(pd.read_csv(request.files.get('file'),skiprows=1, sep=",", names=["email", "language", "location", "mobile", "name"], index_col=False))
    result = csv_file.to_json(orient="records")
    parsed = loads(result)
    importDotTopicAssignmentss(parsed)
    return jsonify({"success": True})


@bp.route('/<id>',  methods=['DELETE'])
@require_oauth()
def deletebyId(id):
    deleteById(id)
    return jsonify({"success": True})


@bp.route('/buddy_search',  methods=['POST'])
@require_oauth()
def buddy_search():
    filterDict = request.get_json(force=True)
    dotUserDetailss = buddySearch(filterDict)
    dotUserDetailsMaps = []
    for dotUserDetails in dotUserDetailss:
        dotUserDetails.user_phone_num = decrypt_message(dotUserDetails.user_phone_num)
        dotUserDetailsMaps.append(dotUserDetails.as_dict())
    return jsonify(dotUserDetailsMaps), 200, {'X-Total-Count': len(dotUserDetailss)}

