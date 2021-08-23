from flask import Blueprint, request
from flask import jsonify
from website.service_dir.dot_reward_setup_service import createDotRewardSetup, updateDotRewardSetup
from website.service_dir.dot_reward_setup_service import findAll, findById, findBy
from website.service_dir.dot_reward_setup_service import importDotRewardSetups, deleteById
from website.oauth2 import require_oauth
from website.model_dir.dot_reward_setup import DotRewardSetup
from json import loads
import pandas as pd

bp = Blueprint(__name__, 'dotRewardSetup')


@bp.route('', methods=['POST', 'PUT', 'GET'])
@require_oauth()
def dotRewardSetupOps():
    dotRewardSetupObj = DotRewardSetup()
    if request.method == 'POST':
        dotRewardSetup = request.get_json(force=True)
        dotRewardSetupObj = createDotRewardSetup(dotRewardSetup)

    elif request.method == 'PUT':
        dotRewardSetup = request.get_json(force=True)
        dotRewardSetupObj = updateDotRewardSetup(dotRewardSetup)

    elif request.method == 'GET':
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        sort = request.args.get('sort', 'lastmodified_date,desc', type=str)
        dotRewardSetupPages = findAll(page, per_page, sort)
        dotRewardSetups = dotRewardSetupPages.items
        dotRewardSetupMaps = []
        for dotRewardSetup in dotRewardSetups:
            dotRewardSetupMaps.append(dotRewardSetup.as_dict())

        return jsonify(dotRewardSetupMaps), 200, {'X-Total-Count': dotRewardSetupPages.total}
    return jsonify(dotRewardSetupObj.as_dict())


@bp.route('/<id>',  methods=['GET'])
@require_oauth()
def findbyId(id):
    dotRewardSetup = findById(id)
    return jsonify(dotRewardSetup.as_dict())


@bp.route('/filter',  methods=['POST'])
@require_oauth()
def findbyFilter():
    filterDict = request.get_json(force=True)
    dotRewardSetups = findBy(**filterDict)
    dotRewardSetupMaps = []
    for dotRewardSetup in dotRewardSetups:
        dotRewardSetupMaps.append(dotRewardSetup.as_dict())
    return jsonify(dotRewardSetupMaps), 200, {'X-Total-Count': len(dotRewardSetups)}


@bp.route('/import',  methods=['POST'])
@require_oauth()
def importDotRewardSetupsRoute():
    csv_file = pd.DataFrame(pd.read_csv(request.files.get('file'),skiprows=1, sep=",", names=["email", "language", "location", "mobile", "name"], index_col=False))
    result = csv_file.to_json(orient="records")
    parsed = loads(result)
    importDotRewardSetups(parsed)
    return jsonify({"success": True})


@bp.route('/<id>',  methods=['DELETE'])
@require_oauth()
def deletebyId(id):
    deleteById(id)
    return jsonify({"success": True})



