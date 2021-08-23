from flask import Blueprint, request
from flask import jsonify
from website.service_dir.dot_tags_entity_rel_service import createDotTagsEntityRel, updateDotTagsEntityRel
from website.service_dir.dot_tags_entity_rel_service import findAll, findById, findBy
from website.service_dir.dot_tags_entity_rel_service import importDotTagsEntityRels, deleteById
from website.oauth2 import require_oauth
from website.model_dir.dot_tags_entity_rel import DotTagsEntityRel
from json import loads
import pandas as pd

bp = Blueprint(__name__, 'dotTagsEntityRel')


@bp.route('', methods=['POST', 'PUT', 'GET'])
@require_oauth()
def dotTagsEntityRelOps():
    dotTagsEntityRelObj = DotTagsEntityRel()
    if request.method == 'POST':
        dotTagsEntityRel = request.get_json(force=True)
        dotTagsEntityRelObj = createDotTagsEntityRel(dotTagsEntityRel)

    elif request.method == 'PUT':
        dotTagsEntityRel = request.get_json(force=True)
        dotTagsEntityRelObj = updateDotTagsEntityRel(dotTagsEntityRel)

    elif request.method == 'GET':
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        sort = request.args.get('sort', 'lastmodified_date,desc', type=str)
        dotTagsEntityRelPages = findAll(page, per_page, sort)
        dotTagsEntityRels = dotTagsEntityRelPages.items
        dotTagsEntityRelMaps = []
        for dotTagsEntityRel in dotTagsEntityRels:
            dotTagsEntityRelMaps.append(dotTagsEntityRel.as_dict())

        return jsonify(dotTagsEntityRelMaps), 200, {'X-Total-Count': dotTagsEntityRelPages.total}
    return jsonify(dotTagsEntityRelObj.as_dict())


@bp.route('/<id>',  methods=['GET'])
@require_oauth()
def findbyId(id):
    dotTagsEntityRel = findById(id)
    return jsonify(dotTagsEntityRel.as_dict())


@bp.route('/filter',  methods=['POST'])
@require_oauth()
def findbyFilter():
    filterDict = request.get_json(force=True)
    dotTagsEntityRels = findBy(**filterDict)
    dotTagsEntityRelMaps = []
    for dotTagsEntityRel in dotTagsEntityRels:
        dotTagsEntityRelMaps.append(dotTagsEntityRel.as_dict())
    return jsonify(dotTagsEntityRelMaps), 200, {'X-Total-Count': len(dotTagsEntityRels)}


@bp.route('/import',  methods=['POST'])
@require_oauth()
def importDotTagsEntityRelsRoute():
    csv_file = pd.DataFrame(pd.read_csv(request.files.get('file'),skiprows=1, sep=",", names=["email", "language", "location", "mobile", "name"], index_col=False))
    result = csv_file.to_json(orient="records")
    parsed = loads(result)
    importDotTagsEntityRels(parsed)
    return jsonify({"success": True})


@bp.route('/<id>',  methods=['DELETE'])
@require_oauth()
def deletebyId(id):
    deleteById(id)
    return jsonify({"success": True})
