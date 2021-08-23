from flask import Blueprint, request
from flask import jsonify
from website.service_dir.dot_group_white_board_service import createDotGroupWhiteBoard, updateDotGroupWhiteBoard
from website.service_dir.dot_group_white_board_service import findAll, findById, findBy
from website.service_dir.dot_group_white_board_service import importDotGroupWhiteBoards, deleteById
from website.oauth2 import require_oauth
from website.model_dir.dot_group_white_board import DotGroupWhiteBoard
from json import loads
import pandas as pd

bp = Blueprint(__name__, 'dotGroupWhiteBoard')


@bp.route('', methods=['POST', 'PUT', 'GET'])
@require_oauth()
def dotGroupWhiteBoardOps():
    dotGroupWhiteBoardObj = DotGroupWhiteBoard()
    if request.method == 'POST':
        dotGroupWhiteBoard = request.get_json(force=True)
        dotGroupWhiteBoardObj = createDotGroupWhiteBoard(dotGroupWhiteBoard)

    elif request.method == 'PUT':
        dotGroupWhiteBoard = request.get_json(force=True)
        dotGroupWhiteBoardObj = updateDotGroupWhiteBoard(dotGroupWhiteBoard)

    elif request.method == 'GET':
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        sort = request.args.get('sort', 'lastmodified_date,desc', type=str)
        dotGroupWhiteBoardPages = findAll(page, per_page, sort)
        dotGroupWhiteBoards = dotGroupWhiteBoardPages.items
        dotGroupWhiteBoardMaps = []
        for dotGroupWhiteBoard in dotGroupWhiteBoards:
            dotGroupWhiteBoardMaps.append(dotGroupWhiteBoard.as_dict())

        return jsonify(dotGroupWhiteBoardMaps), 200, {'X-Total-Count': dotGroupWhiteBoardPages.total}
    return jsonify(dotGroupWhiteBoardObj.as_dict())


@bp.route('/<id>',  methods=['GET'])
@require_oauth()
def findbyId(id):
    dotGroupWhiteBoard = findById(id)
    return jsonify(dotGroupWhiteBoard.as_dict())


@bp.route('/filter',  methods=['POST'])
@require_oauth()
def findbyFilter():
    filterDict = request.get_json(force=True)
    dotGroupWhiteBoards = findBy(**filterDict)
    dotGroupWhiteBoardMaps = []
    for dotGroupWhiteBoard in dotGroupWhiteBoards:
        dotGroupWhiteBoardMaps.append(dotGroupWhiteBoard.as_dict())
    return jsonify(dotGroupWhiteBoardMaps), 200, {'X-Total-Count': len(dotGroupWhiteBoards)}


@bp.route('/import',  methods=['POST'])
@require_oauth()
def importDotGroupWhiteBoardsRoute():
    csv_file = pd.DataFrame(pd.read_csv(request.files.get('file'),skiprows=1, sep=",", names=["email", "language", "location", "mobile", "name"], index_col=False))
    result = csv_file.to_json(orient="records")
    parsed = loads(result)
    importDotGroupWhiteBoards(parsed)
    return jsonify({"success": True})


@bp.route('/<id>',  methods=['DELETE'])
@require_oauth()
def deletebyId(id):
    deleteById(id)
    return jsonify({"success": True})
