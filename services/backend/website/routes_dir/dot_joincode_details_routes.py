from flask import Blueprint, request
from flask import jsonify
from website.service_dir.dot_joincode_details_service import createDotJoincodeDetails, updateDotJoincodeDetails
from website.service_dir.dot_joincode_details_service import findAll, findById, findBy
from website.service_dir.dot_joincode_details_service import importDotJoincodeDetailss, deleteById
from website.oauth2 import require_oauth
from website.model_dir.dot_joincode_details import DotJoincodeDetails
from json import loads
import pandas as pd

bp = Blueprint(__name__, 'dotJoincodeDetails')


@bp.route('', methods=['POST', 'PUT', 'GET'])
@require_oauth()
def dotJoincodeDetailsOps():
    dotJoincodeDetailsObj = DotJoincodeDetails()
    if request.method == 'POST':
        dotJoincodeDetails = request.get_json(force=True)
        dotJoincodeDetailsObj = createDotJoincodeDetails(dotJoincodeDetails)

    elif request.method == 'PUT':
        dotJoincodeDetails = request.get_json(force=True)
        dotJoincodeDetailsObj = updateDotJoincodeDetails(dotJoincodeDetails)

    elif request.method == 'GET':
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        sort = request.args.get('sort', 'lastmodified_date,desc', type=str)
        dotJoincodeDetailsPages = findAll(page, per_page, sort)
        dotJoincodeDetailss = dotJoincodeDetailsPages.items
        dotJoincodeDetailsMaps = []
        for dotJoincodeDetails in dotJoincodeDetailss:
            dotJoincodeDetailsMaps.append(dotJoincodeDetails.as_dict())

        return jsonify(dotJoincodeDetailsMaps), 200, {'X-Total-Count': dotJoincodeDetailsPages.total}
    return jsonify(dotJoincodeDetailsObj.as_dict())


@bp.route('/<id>',  methods=['GET'])
@require_oauth()
def findbyId(id):
    dotJoincodeDetails = findById(id)
    return jsonify(dotJoincodeDetails.as_dict())


@bp.route('/filter',  methods=['POST'])
@require_oauth()
def findbyFilter():
    filterDict = request.get_json(force=True)
    dotJoincodeDetailss = findBy(**filterDict)
    dotJoincodeDetailsMaps = []
    for dotJoincodeDetails in dotJoincodeDetailss:
        dotJoincodeDetailsMaps.append(dotJoincodeDetails.as_dict())
    return jsonify(dotJoincodeDetailsMaps), 200, {'X-Total-Count': len(dotJoincodeDetailss)}


@bp.route('/import',  methods=['POST'])
@require_oauth()
def importDotJoincodeDetailssRoute():
    csv_file = pd.DataFrame(pd.read_csv(request.files.get('file'),skiprows=1, sep=",", names=["email", "language", "location", "mobile", "name"], index_col=False))
    result = csv_file.to_json(orient="records")
    parsed = loads(result)
    importDotJoincodeDetailss(parsed)
    return jsonify({"success": True})


@bp.route('/<id>',  methods=['DELETE'])
@require_oauth()
def deletebyId(id):
    deleteById(id)
    return jsonify({"success": True})
