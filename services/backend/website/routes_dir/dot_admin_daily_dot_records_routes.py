from flask import Blueprint, request
from flask import jsonify
from website.service_dir.dot_admin_daily_dot_records_service import createDotAdminDailyDotRecords, updateDotAdminDailyDotRecords
from website.service_dir.dot_admin_daily_dot_records_service import findAll, findById, findBy
from website.service_dir.dot_admin_daily_dot_records_service import importDotAdminDailyDotRecordss, deleteById
from website.oauth2 import require_oauth
from website.model_dir.dot_admin_daily_dot_records import DotAdminDailyDotRecords
from json import loads
import pandas as pd

bp = Blueprint(__name__, 'dotAdminDailyDotRecords')


@bp.route('', methods=['POST', 'PUT', 'GET'])
@require_oauth()
def dotAdminDailyDotRecordsOps():
    dotAdminDailyDotRecordsObj = DotAdminDailyDotRecords()
    if request.method == 'POST':
        dotAdminDailyDotRecords = request.get_json(force=True)
        dotAdminDailyDotRecordsObj = createDotAdminDailyDotRecords(dotAdminDailyDotRecords)

    elif request.method == 'PUT':
        dotAdminDailyDotRecords = request.get_json(force=True)
        dotAdminDailyDotRecordsObj = updateDotAdminDailyDotRecords(dotAdminDailyDotRecords)

    elif request.method == 'GET':
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        sort = request.args.get('sort', 'lastmodified_date,desc', type=str)
        dotAdminDailyDotRecordsPages = findAll(page, per_page, sort)
        dotAdminDailyDotRecordss = dotAdminDailyDotRecordsPages.items
        dotAdminDailyDotRecordsMaps = []
        for dotAdminDailyDotRecords in dotAdminDailyDotRecordss:
            dotAdminDailyDotRecordsMaps.append(dotAdminDailyDotRecords.as_dict())

        return jsonify(dotAdminDailyDotRecordsMaps), 200, {'X-Total-Count': dotAdminDailyDotRecordsPages.total}
    return jsonify(dotAdminDailyDotRecordsObj.as_dict())


@bp.route('/<id>',  methods=['GET'])
@require_oauth()
def findbyId(id):
    dotAdminDailyDotRecords = findById(id)
    return jsonify(dotAdminDailyDotRecords.as_dict())


@bp.route('/filter',  methods=['POST'])
@require_oauth()
def findbyFilter():
    filterDict = request.get_json(force=True)
    dotAdminDailyDotRecordss = findBy(**filterDict)
    dotAdminDailyDotRecordsMaps = []
    for dotAdminDailyDotRecords in dotAdminDailyDotRecordss:
        dotAdminDailyDotRecordsMaps.append(dotAdminDailyDotRecords.as_dict())
    return jsonify(dotAdminDailyDotRecordsMaps), 200, {'X-Total-Count': len(dotAdminDailyDotRecordss)}


@bp.route('/import',  methods=['POST'])
@require_oauth()
def importDotAdminDailyDotRecordssRoute():
    csv_file = pd.DataFrame(pd.read_csv(request.files.get('file'),skiprows=1, sep=",", names=["daily_dot_type", "record_date", "record_title", "record_description", "option1", "option2", "option3", "option4", "date_of_publish", "record_status", "is_active"], index_col=False, encoding='utf-8'))
    result = csv_file.to_json(orient="records")
    parsed = loads(result)
    importDotAdminDailyDotRecordss(parsed)
    return jsonify(parsed)


@bp.route('/<id>',  methods=['DELETE'])
@require_oauth()
def deletebyId(id):
    deleteById(id)
    return jsonify({"success": True})
