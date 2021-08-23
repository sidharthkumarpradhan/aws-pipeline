from flask import Blueprint, request
from flask import jsonify
from website.service_dir.dot_personality_quiz_service import createDotPersonalityQuiz, updateDotPersonalityQuiz
from website.service_dir.dot_personality_quiz_service import findAll, findById, findBy
from website.service_dir.dot_personality_quiz_service import importDotPersonalityQuizs, deleteById
from website.oauth2 import require_oauth
from website.model_dir.dot_personality_quiz import DotPersonalityQuiz
from json import loads
import pandas as pd

bp = Blueprint(__name__, 'dotPersonalityQuiz')


@bp.route('', methods=['POST', 'PUT', 'GET'])
@require_oauth()
def dotPersonalityQuizOps():
    dotPersonalityQuizObj = DotPersonalityQuiz()
    if request.method == 'POST':
        dotPersonalityQuiz = request.get_json(force=True)
        dotPersonalityQuizObj = createDotPersonalityQuiz(dotPersonalityQuiz)

    elif request.method == 'PUT':
        dotPersonalityQuiz = request.get_json(force=True)
        dotPersonalityQuizObj = updateDotPersonalityQuiz(dotPersonalityQuiz)

    elif request.method == 'GET':
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        sort = request.args.get('sort', 'lastmodified_date,desc', type=str)
        dotPersonalityQuizPages = findAll(page, per_page, sort)
        dotPersonalityQuizs = dotPersonalityQuizPages.items
        dotPersonalityQuizMaps = []
        for dotPersonalityQuiz in dotPersonalityQuizs:
            dotPersonalityQuizMaps.append(dotPersonalityQuiz.as_dict())

        return jsonify(dotPersonalityQuizMaps), 200, {'X-Total-Count': dotPersonalityQuizPages.total}
    return jsonify(dotPersonalityQuizObj.as_dict())


@bp.route('/<id>',  methods=['GET'])
@require_oauth()
def findbyId(id):
    dotPersonalityQuiz = findById(id)
    return jsonify(dotPersonalityQuiz.as_dict())


@bp.route('/filter',  methods=['POST'])
@require_oauth()
def findbyFilter():
    filterDict = request.get_json(force=True)
    dotPersonalityQuizs = findBy(**filterDict)
    dotPersonalityQuizMaps = []
    for dotPersonalityQuiz in dotPersonalityQuizs:
        dotPersonalityQuizMaps.append(dotPersonalityQuiz.as_dict())
    return jsonify(dotPersonalityQuizMaps), 200, {'X-Total-Count': len(dotPersonalityQuizs)}


@bp.route('/import',  methods=['POST'])
@require_oauth()
def importDotPersonalityQuizsRoute():
    csv_file = pd.DataFrame(pd.read_csv(request.files.get('file'),skiprows=1, sep=",", names=["email", "language", "location", "mobile", "name"], index_col=False))
    result = csv_file.to_json(orient="records")
    parsed = loads(result)
    importDotPersonalityQuizs(parsed)
    return jsonify({"success": True})


@bp.route('/<id>',  methods=['DELETE'])
@require_oauth()
def deletebyId(id):
    deleteById(id)
    return jsonify({"success": True})
