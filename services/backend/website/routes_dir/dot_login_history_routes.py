from flask import Blueprint, request
from flask import jsonify
from website.service_dir.dot_login_history_service import createDotLoginHistory, updateDotLoginHistory
from website.service_dir.dot_login_history_service import findAll, findById, findBy
from website.service_dir.dot_login_history_service import importDotLoginHistorys, deleteById
from website.oauth2 import require_oauth
from website.model_dir.dot_login_history import DotLoginHistory
from json import loads
import pandas as pd

bp = Blueprint(__name__, 'dotLoginHistory')


@bp.route('', methods=['POST', 'PUT', 'GET'])
@require_oauth()
def dotLoginHistoryOps():
    dotLoginHistoryObj = DotLoginHistory()
    if request.method == 'POST':
        dotLoginHistory = request.get_json(force=True)
        dotLoginHistoryObj = createDotLoginHistory(dotLoginHistory)

    elif request.method == 'PUT':
        dotLoginHistory = request.get_json(force=True)
        dotLoginHistoryObj = updateDotLoginHistory(dotLoginHistory)

    elif request.method == 'GET':
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        sort = request.args.get('sort', 'lastmodified_date,desc', type=str)
        dotLoginHistoryPages = findAll(page, per_page, sort)
        dotLoginHistorys = dotLoginHistoryPages.items
        dotLoginHistoryMaps = []
        for dotLoginHistory in dotLoginHistorys:
            dotLoginHistoryMaps.append(dotLoginHistory.as_dict())

        return jsonify(dotLoginHistoryMaps), 200, {'X-Total-Count': dotLoginHistoryPages.total}
    return jsonify(dotLoginHistoryObj.as_dict())


@bp.route('/<id>',  methods=['GET'])
@require_oauth()
def findbyId(id):
    dotLoginHistory = findById(id)
    return jsonify(dotLoginHistory.as_dict())


@bp.route('/filter',  methods=['POST'])
@require_oauth()
def findbyFilter():
    filterDict = request.get_json(force=True)
    dotLoginHistorys = findBy(**filterDict)
    dotLoginHistoryMaps = []
    for dotLoginHistory in dotLoginHistorys:
        dotLoginHistoryMaps.append(dotLoginHistory.as_dict())
    return jsonify(dotLoginHistoryMaps), 200, {'X-Total-Count': len(dotLoginHistorys)}


@bp.route('/import',  methods=['POST'])
@require_oauth()
def importDotLoginHistorysRoute():
    csv_file = pd.DataFrame(pd.read_csv(request.files.get('file'),skiprows=1, sep=",", names=["email", "language", "location", "mobile", "name"], index_col=False))
    result = csv_file.to_json(orient="records")
    parsed = loads(result)
    importDotLoginHistorys(parsed)
    return jsonify({"success": True})


@bp.route('/<id>',  methods=['DELETE'])
@require_oauth()
def deletebyId(id):
    deleteById(id)
    return jsonify({"success": True})
