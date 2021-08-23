from flask import Blueprint, request
from flask import jsonify
from website.service_dir.dot_rewards_service import createDotRewards, updateDotRewards
from website.service_dir.dot_rewards_service import findAll, findById, findBy
from website.service_dir.dot_rewards_service import importDotRewardss, deleteById
from website.oauth2 import require_oauth
from website.model_dir.dot_rewards import DotRewards
from json import loads
import pandas as pd

bp = Blueprint(__name__, 'dotRewards')


@bp.route('', methods=['POST', 'PUT', 'GET'])
@require_oauth()
def dotRewardsOps():
    dotRewardsObj = DotRewards()
    if request.method == 'POST':
        dotRewards = request.get_json(force=True)
        dotRewardsObj = createDotRewards(dotRewards)

    elif request.method == 'PUT':
        dotRewards = request.get_json(force=True)
        dotRewardsObj = updateDotRewards(dotRewards)

    elif request.method == 'GET':
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        sort = request.args.get('sort', 'lastmodified_date,desc', type=str)
        dotRewardsPages = findAll(page, per_page, sort)
        dotRewardss = dotRewardsPages.items
        dotRewardsMaps = []
        for dotRewards in dotRewardss:
            dotRewardsMaps.append(dotRewards.as_dict())

        return jsonify(dotRewardsMaps), 200, {'X-Total-Count': dotRewardsPages.total}
    return jsonify(dotRewardsObj.as_dict())


@bp.route('/<id>',  methods=['GET'])
@require_oauth()
def findbyId(id):
    dotRewards = findById(id)
    return jsonify(dotRewards.as_dict())


@bp.route('/filter',  methods=['POST'])
@require_oauth()
def findbyFilter():
    filterDict = request.get_json(force=True)
    dotRewardss = findBy(**filterDict)
    dotRewardsMaps = []
    for dotRewards in dotRewardss:
        dotRewardsMaps.append(dotRewards.as_dict())
    return jsonify(dotRewardsMaps), 200, {'X-Total-Count': len(dotRewardss)}


@bp.route('/import',  methods=['POST'])
@require_oauth()
def importDotRewardssRoute():
    csv_file = pd.DataFrame(pd.read_csv(request.files.get('file'),skiprows=1, sep=",", names=["email", "language", "location", "mobile", "name"], index_col=False))
    result = csv_file.to_json(orient="records")
    parsed = loads(result)
    importDotRewardss(parsed)
    return jsonify({"success": True})


@bp.route('/<id>',  methods=['DELETE'])
@require_oauth()
def deletebyId(id):
    deleteById(id)
    return jsonify({"success": True})
