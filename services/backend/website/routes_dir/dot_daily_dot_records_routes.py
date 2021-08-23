from flask import Blueprint, request
from flask import jsonify
from website.service_dir.dot_daily_dot_records_service import createDotDailyDotRecords, updateDotDailyDotRecords
from website.service_dir.dot_daily_dot_records_service import findAll, findById, findBy, dailyDotStreak
from website.service_dir.dot_daily_dot_records_service import importDotDailyDotRecordss, deleteById, generateDailydotRecords
from website.oauth2 import require_oauth
from website.model_dir.dot_daily_dot_records import DotDailyDotRecords
from json import loads
import pandas as pd

bp = Blueprint(__name__, 'dotDailyDotRecords')


@bp.route('', methods=['POST', 'PUT', 'GET'])
@require_oauth()
def dotDailyDotRecordsOps():
    dotDailyDotRecordsObj = DotDailyDotRecords()
    if request.method == 'POST':
        dotDailyDotRecords = request.get_json(force=True)
        dotDailyDotRecordsObj = createDotDailyDotRecords(dotDailyDotRecords)

    elif request.method == 'PUT':
        dotDailyDotRecords = request.get_json(force=True)
        dotDailyDotRecordsObj = updateDotDailyDotRecords(dotDailyDotRecords)

    elif request.method == 'GET':
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        sort = request.args.get('sort', 'lastmodified_date,desc', type=str)
        dotDailyDotRecordsPages = findAll(page, per_page, sort)
        dotDailyDotRecordss = dotDailyDotRecordsPages.items
        dotDailyDotRecordsMaps = []
        for dotDailyDotRecords in dotDailyDotRecordss:
            dotDailyDotRecordsMaps.append(dotDailyDotRecords.as_dict())

        return jsonify(dotDailyDotRecordsMaps), 200, {'X-Total-Count': dotDailyDotRecordsPages.total}
    return jsonify(dotDailyDotRecordsObj.as_dict())


@bp.route('/<id>',  methods=['GET'])
@require_oauth()
def findbyId(id):
    dotDailyDotRecords = findById(id)
    return jsonify(dotDailyDotRecords.as_dict())


@bp.route('/filter',  methods=['POST'])
@require_oauth()
def findbyFilter():
    filterDict = request.get_json(force=True)
    dotDailyDotRecordss = findBy("all", **filterDict)
    dotDailyDotRecordsMaps = []
    if len(dotDailyDotRecordss) == 0:
        generateDailydotRecords()
    dotDailyDotRecordss = findBy("all", **filterDict)
    for dotDailyDotRecords in dotDailyDotRecordss:
        dotDailyDotRecordsMaps.append(dotDailyDotRecords.as_dict())
    return jsonify(dotDailyDotRecordsMaps), 200, {'X-Total-Count': len(dotDailyDotRecordss)}


@bp.route('/import',  methods=['POST'])
@require_oauth()
def importDotDailyDotRecordssRoute():
    csv_file = pd.DataFrame(pd.read_csv(request.files.get('file'),skiprows=1, sep=",", names=["email", "language", "location", "mobile", "name"], index_col=False))
    result = csv_file.to_json(orient="records")
    parsed = loads(result)
    importDotDailyDotRecordss(parsed)
    return jsonify({"success": True})


@bp.route('/<id>',  methods=['DELETE'])
@require_oauth()
def deletebyId(id):
    deleteById(id)
    return jsonify({"success": True})


@bp.route('/dashboard',  methods=['POST'])
@require_oauth()
def dashboard():
    filterDict = request.get_json(force=True)
    dotDailyDotRecordss = findBy(10, **filterDict)
    dotDailyDotRecordsMaps = []
    for dotDailyDotRecords in dotDailyDotRecordss:
        dotDailyDotRecordsMaps.append(dotDailyDotRecords.as_dict())
    return jsonify(dotDailyDotRecordsMaps), 200, {'X-Total-Count': len(dotDailyDotRecordss)}


@bp.route('/streak',  methods=['GET'])
@require_oauth()
def streak():
    dotDailyDotRecordss = dailyDotStreak()
    return jsonify(dotDailyDotRecordss)
