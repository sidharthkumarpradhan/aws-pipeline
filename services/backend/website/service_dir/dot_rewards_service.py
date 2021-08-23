from website.model_dir.dot_rewards import DotRewards
from website.utils_dir.common_utils import getSort
from sqlalchemy import or_


def createDotRewards(dotRewardsJson):
    dotRewards = DotRewards()
    dotRewards = dotRewards.as_model(dotRewardsJson)
    dotRewards.save()
    return dotRewards


def updateDotRewards(dotRewardsJson):
    dotRewards = DotRewards()
    dotRewards = dotRewards.as_model(dotRewardsJson)
    dotRewards.update()
    return dotRewards


def findById(id):
    return DotRewards.query.get(id)


def findAll(page, per_page, sort_column):
    return DotRewards.query.order_by(getSort(sort_column)).paginate(page, per_page, error_out=False)


def findBy(**kwargs):
    condition_arr = []
    for col, val in kwargs.items():
        condition_arr.append(getattr(DotRewards, col).ilike(f'{val}%'))
    condition = or_(*condition_arr)
    return DotRewards.query.filter(condition).all()


def importDotRewardss(dotRewardssJson):
    modelList = []
    for i in dotRewardssJson:
        dotRewards = DotRewards()
        dotRewards = dotRewards.as_model(i)
        modelList.append(dotRewards)
    dotRewards = DotRewards()
    dotRewards.saveAll(modelList)


def deleteById(id):
    dotRewards = findById(id)
    dotRewards.delete()
