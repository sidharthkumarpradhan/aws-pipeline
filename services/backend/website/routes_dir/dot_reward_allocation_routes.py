from flask import Blueprint, request
from flask import jsonify
from website.service_dir.dot_reward_allocation_service import createDotRewardAllocation, updateDotRewardAllocation
from website.service_dir.dot_reward_allocation_service import findAll, findById, findBy
from website.service_dir.dot_reward_allocation_service import importDotRewardAllocations, deleteById, dotBadges
from website.service_dir.dot_reward_allocation_service import leaderBoard, dotAchievements
from website.oauth2 import require_oauth
from website.model_dir.dot_reward_allocation import DotRewardAllocation
from json import loads
import pandas as pd

bp = Blueprint(__name__, 'dotRewardAllocation')


@bp.route('', methods=['POST', 'PUT', 'GET'])
@require_oauth()
def dotRewardAllocationOps():
    dotRewardAllocationObj = DotRewardAllocation()
    if request.method == 'POST':
        dotRewardAllocation = request.get_json(force=True)
        dotRewardAllocationObj = createDotRewardAllocation(dotRewardAllocation)

    elif request.method == 'PUT':
        dotRewardAllocation = request.get_json(force=True)
        dotRewardAllocationObj = updateDotRewardAllocation(dotRewardAllocation)

    elif request.method == 'GET':
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        sort = request.args.get('sort', 'lastmodified_date,desc', type=str)
        dotRewardAllocationPages = findAll(page, per_page, sort)
        dotRewardAllocations = dotRewardAllocationPages.items
        dotRewardAllocationMaps = []
        for dotRewardAllocation in dotRewardAllocations:
            dotRewardAllocationMaps.append(dotRewardAllocation.as_dict())
        return jsonify(dotRewardAllocationMaps), 200, {'X-Total-Count': dotRewardAllocationPages.total}
    return jsonify(dotRewardAllocationObj.as_dict())


@bp.route('/<id>',  methods=['GET'])
@require_oauth()
def findbyId(id):
    dotRewardAllocation = findById(id)
    return jsonify(dotRewardAllocation.as_dict())


@bp.route('/filter',  methods=['POST'])
@require_oauth()
def findbyFilter():
    filterDict = request.get_json(force=True)
    dotRewardAllocations = findBy(**filterDict)
    dotRewardAllocationMaps = []
    for dotRewardAllocation in dotRewardAllocations:
        dotRewardAllocationMaps.append(dotRewardAllocation.as_dict())
    return jsonify(dotRewardAllocationMaps), 200, {'X-Total-Count': len(dotRewardAllocations)}


@bp.route('/import',  methods=['POST'])
@require_oauth()
def importDotRewardAllocationsRoute():
    csv_file = pd.DataFrame(pd.read_csv(request.files.get('file'),skiprows=1, sep=",", names=["email", "language", "location", "mobile", "name"], index_col=False))
    result = csv_file.to_json(orient="records")
    parsed = loads(result)
    importDotRewardAllocations(parsed)
    return jsonify({"success": True})


@bp.route('/<id>',  methods=['DELETE'])
@require_oauth()
def deletebyId(id):
    deleteById(id)
    return jsonify({"success": True})


@bp.route('/leader_board',  methods=['GET'])
@require_oauth()
def leader_board():
    leaderBoards = leaderBoard()
    return jsonify(leaderBoards)



@bp.route('/achievements', methods=['POST'])
@require_oauth()
def achievements():
    filterDict = request.get_json(force=True)
    dot_achievements = dotAchievements(filterDict)
    return jsonify(dot_achievements)


@bp.route('/badges', methods=['POST'])
@require_oauth()
def my_badges():
    filterDict = request.get_json(force=True)
    dot_badges = dotBadges(filterDict)
    return jsonify(dot_badges)
