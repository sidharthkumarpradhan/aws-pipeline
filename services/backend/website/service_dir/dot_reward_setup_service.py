from website.exceptions_dir.base_exceptions import BadRequest
from website.model_dir.dot_reward_setup import DotRewardSetup
from website.utils_dir.common_utils import getSort
from sqlalchemy import or_, text, and_
from website.model_dir.base_model import db


def createDotRewardSetup(dotRewardSetupJson):
    duplicateDotRewards = DotRewardSetup.query.filter(and_(DotRewardSetup.topic_id == dotRewardSetupJson['topic'], DotRewardSetup.reward_action == dotRewardSetupJson['reward_action'])).count()
    if duplicateDotRewards > 0:
        error = "Duplicate configuration"
        raise BadRequest(error)
    else:
        dotRewardSetup = DotRewardSetup()
        dotRewardSetup = dotRewardSetup.as_model(dotRewardSetupJson)
        dotRewardSetup.save()
        return dotRewardSetup


def updateDotRewardSetup(dotRewardSetupJson):
    dotRewardSetup = DotRewardSetup()
    dotRewardSetup = dotRewardSetup.as_model(dotRewardSetupJson)
    dotRewardSetup.update()
    return dotRewardSetup


def findById(id):
    return DotRewardSetup.query.get(id)


def findAll(page, per_page, sort_column):
    return DotRewardSetup.query.order_by(getSort(sort_column)).paginate(page, per_page, error_out=False)


def findBy(**kwargs):
    condition_arr = []
    for col, val in kwargs.items():
        condition_arr.append(getattr(DotRewardSetup, col).ilike(f'{val}%'))
    condition = or_(*condition_arr)
    return DotRewardSetup.query.filter(condition).all()


def importDotRewardSetups(dotRewardSetupsJson):
    modelList = []
    for i in dotRewardSetupsJson:
        dotRewardSetup = DotRewardSetup()
        dotRewardSetup = dotRewardSetup.as_model(i)
        modelList.append(dotRewardSetup)
    dotRewardSetup = DotRewardSetup()
    dotRewardSetup.saveAll(modelList)


def deleteById(id):
    dotRewardSetup = findById(id)
    dotRewardSetup.delete()


