from flask import Blueprint, request
from flask import jsonify
from website.service_dir.dot_tags_service import createDotTags, updateDotTags
from website.service_dir.dot_tags_service import findAll, findById, findBy
from website.service_dir.dot_tags_service import importDotTagss, deleteById
from website.oauth2 import require_oauth
from website.model_dir.dot_tags import DotTags
from json import loads
import pandas as pd

bp = Blueprint(__name__, 'dotTags')


@bp.route('', methods=['POST', 'PUT', 'GET'])
@require_oauth()
def dotTagsOps():
    dotTagsObj = DotTags()
    if request.method == 'POST':
        dotTags = request.get_json(force=True)
        dotTagsObj = createDotTags(dotTags)

    elif request.method == 'PUT':
        dotTags = request.get_json(force=True)
        dotTagsObj = updateDotTags(dotTags)

    elif request.method == 'GET':
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        sort = request.args.get('sort', 'lastmodified_date,desc', type=str)
        dotTagsPages = findAll(page, per_page, sort)
        dotTagss = dotTagsPages.items
        dotTagsMaps = []
        for dotTags in dotTagss:
            dotTagsMaps.append(dotTags.as_dict())

        return jsonify(dotTagsMaps), 200, {'X-Total-Count': dotTagsPages.total}
    return jsonify(dotTagsObj.as_dict())


@bp.route('/<id>',  methods=['GET'])
@require_oauth()
def findbyId(id):
    dotTags = findById(id)
    return jsonify(dotTags.as_dict())


@bp.route('/filter',  methods=['POST'])
@require_oauth()
def findbyFilter():
    filterDict = request.get_json(force=True)
    dotTagss = findBy(**filterDict)
    dotTagsMaps = []
    for dotTags in dotTagss:
        dotTagsMaps.append(dotTags.as_dict())
    return jsonify(dotTagsMaps), 200, {'X-Total-Count': len(dotTagss)}


@bp.route('/import',  methods=['POST'])
@require_oauth()
def importDotTagssRoute():
    csv_file = pd.DataFrame(pd.read_csv(request.files.get('file'),skiprows=1, sep=",", names=["email", "language", "location", "mobile", "name"], index_col=False))
    result = csv_file.to_json(orient="records")
    parsed = loads(result)
    importDotTagss(parsed)
    return jsonify({"success": True})


@bp.route('/<id>',  methods=['DELETE'])
@require_oauth()
def deletebyId(id):
    deleteById(id)
    return jsonify({"success": True})
