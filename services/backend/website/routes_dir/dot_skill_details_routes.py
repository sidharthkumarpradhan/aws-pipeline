from flask import Blueprint, request
from flask import jsonify
from website.service_dir.dot_skill_details_service import createDotSkillDetails, updateDotSkillDetails
from website.service_dir.dot_skill_details_service import findAll, findById, findBy
from website.service_dir.dot_skill_details_service import importDotSkillDetailss, deleteById, skillsByCategory
from website.oauth2 import require_oauth
from website.model_dir.dot_skill_details import DotSkillDetails
from json import loads
import pandas as pd

bp = Blueprint(__name__, 'dotSkillDetails')


@bp.route('', methods=['POST', 'PUT', 'GET'])
@require_oauth()
def dotSkillDetailsOps():
    dotSkillDetailsObj = DotSkillDetails()
    if request.method == 'POST':
        dotSkillDetails = request.get_json(force=True)
        dotSkillDetailsObj = createDotSkillDetails(dotSkillDetails)

    elif request.method == 'PUT':
        dotSkillDetails = request.get_json(force=True)
        dotSkillDetailsObj = updateDotSkillDetails(dotSkillDetails)

    elif request.method == 'GET':
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        sort = request.args.get('sort', 'lastmodified_date,desc', type=str)
        dotSkillDetailsPages = findAll(page, per_page, sort)
        dotSkillDetailss = dotSkillDetailsPages.items
        dotSkillDetailsMaps = []
        for dotSkillDetails in dotSkillDetailss:
            dotSkillDetailsMaps.append(dotSkillDetails.as_dict())

        return jsonify(dotSkillDetailsMaps), 200, {'X-Total-Count': dotSkillDetailsPages.total}
    return jsonify(dotSkillDetailsObj.as_dict())


@bp.route('/<category>', methods=['GET'])
@require_oauth()
def skills_by_category(category):
    dotSkillDetailss = skillsByCategory(category)
    dotSkillDetailsMaps = []
    for dotSkillDetails in dotSkillDetailss:
        dotSkillDetailsMaps.append(dotSkillDetails.as_dict())
    return jsonify(dotSkillDetailsMaps)




@bp.route('/filter',  methods=['POST'])
@require_oauth()
def findbyFilter():
    filterDict = request.get_json(force=True)
    dotSkillDetailss = findBy(**filterDict)
    dotSkillDetailsMaps = []
    for dotSkillDetails in dotSkillDetailss:
        dotSkillDetailsMaps.append(dotSkillDetails.as_dict())
    return jsonify(dotSkillDetailsMaps), 200, {'X-Total-Count': len(dotSkillDetailss)}


@bp.route('/import',  methods=['POST'])
@require_oauth()
def importDotSkillDetailssRoute():
    csv_file = pd.DataFrame(pd.read_csv(request.files.get('file'),skiprows=1, sep=",", names=["email", "language", "location", "mobile", "name"], index_col=False))
    result = csv_file.to_json(orient="records")
    parsed = loads(result)
    importDotSkillDetailss(parsed)
    return jsonify({"success": True})


@bp.route('/<id>',  methods=['DELETE'])
@require_oauth()
def deletebyId(id):
    deleteById(id)
    return jsonify({"success": True})
