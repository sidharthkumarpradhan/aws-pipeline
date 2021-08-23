from flask import Blueprint, request
from flask import jsonify
from website.service_dir.dot_daily_dot_service import createDotDailyDot, updateDotDailyDot
from website.service_dir.dot_daily_dot_service import findAll, findById, findBy
from website.service_dir.dot_daily_dot_service import importDotDailyDots, deleteById
from website.oauth2 import require_oauth
from website.model_dir.dot_daily_dot import DotDailyDot
from json import loads
import pandas as pd

bp = Blueprint(__name__, 'dotDailyDot')


@bp.route('', methods=['POST', 'PUT', 'GET'])
@require_oauth()
def dotDailyDotOps():
    dotDailyDotObj = DotDailyDot()
    if request.method == 'POST':
        dotDailyDot = request.get_json(force=True)
        dotDailyDotObj = createDotDailyDot(dotDailyDot)

    elif request.method == 'PUT':
        dotDailyDot = request.get_json(force=True)
        dotDailyDotObj = updateDotDailyDot(dotDailyDot)

    elif request.method == 'GET':
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        sort = request.args.get('sort', 'lastmodified_date,desc', type=str)
        dotDailyDotPages = findAll(page, per_page, sort)
        dotDailyDots = dotDailyDotPages.items
        dotDailyDotMaps = []
        for dotDailyDot in dotDailyDots:
            dotDailyDotMaps.append(dotDailyDot.as_dict())

        return jsonify(dotDailyDotMaps), 200, {'X-Total-Count': dotDailyDotPages.total}
    return jsonify(dotDailyDotObj.as_dict())


@bp.route('/<id>',  methods=['GET'])
@require_oauth()
def findbyId(id):
    dotDailyDot = findById(id)
    return jsonify(dotDailyDot.as_dict())


@bp.route('/filter',  methods=['POST'])
@require_oauth()
def findbyFilter():
    filterDict = request.get_json(force=True)
    dotDailyDots = findBy(**filterDict)
    dotDailyDotMaps = []
    for dotDailyDot in dotDailyDots:
        dotDailyDotMaps.append(dotDailyDot.as_dict())
    return jsonify(dotDailyDotMaps), 200, {'X-Total-Count': len(dotDailyDots)}


@bp.route('/import',  methods=['POST'])
@require_oauth()
def importDotDailyDotsRoute():
    csv_file = pd.DataFrame(pd.read_csv(request.files.get('file'),skiprows=1, sep=",", names=["email", "language", "location", "mobile", "name"], index_col=False))
    result = csv_file.to_json(orient="records")
    parsed = loads(result)
    importDotDailyDots(parsed)
    return jsonify({"success": True})


@bp.route('/<id>',  methods=['DELETE'])
@require_oauth()
def deletebyId(id):
    deleteById(id)
    return jsonify({"success": True})



