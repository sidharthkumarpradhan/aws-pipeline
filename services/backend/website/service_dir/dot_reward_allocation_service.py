from authlib.integrations.flask_oauth2 import current_token

from website.model_dir.base_model import db
from website.model_dir.dot_reward_allocation import DotRewardAllocation
from website.utils_dir.common_utils import getSort
from sqlalchemy import or_, func, text, desc


def createDotRewardAllocation(dotRewardAllocationJson):
    dotRewardAllocation = DotRewardAllocation()
    dotRewardAllocation = dotRewardAllocation.as_model(dotRewardAllocationJson)
    dotRewardAllocation.save()
    return dotRewardAllocation


def updateDotRewardAllocation(dotRewardAllocationJson):
    dotRewardAllocation = DotRewardAllocation()
    dotRewardAllocation = dotRewardAllocation.as_model(dotRewardAllocationJson)
    dotRewardAllocation.update()
    return dotRewardAllocation


def findById(id):
    return DotRewardAllocation.query.get(id)


def findAll(page, per_page, sort_column):
    return DotRewardAllocation.query.order_by(getSort(sort_column)).paginate(page, per_page, error_out=False)


def findBy(**kwargs):
    condition_arr = []
    for col, val in kwargs.items():
        condition_arr.append(getattr(DotRewardAllocation, col).ilike(f'{val}%'))
    condition = or_(*condition_arr)
    return DotRewardAllocation.query.filter(condition).all()


def importDotRewardAllocations(dotRewardAllocationsJson):
    modelList = []
    for i in dotRewardAllocationsJson:
        dotRewardAllocation = DotRewardAllocation()
        dotRewardAllocation = dotRewardAllocation.as_model(i)
        modelList.append(dotRewardAllocation)
    dotRewardAllocation = DotRewardAllocation()
    dotRewardAllocation.saveAll(modelList)


def deleteById(id):
    dotRewardAllocation = findById(id)
    dotRewardAllocation.delete()


def dotBadges(filterDict):
    myBadgesQuery = text("""SELECT 
    reward_title, reward_badge, topic_id, reward_alloc_date
FROM
    dot_reward_allocation
WHERE
    user_id = ':user_id'
        AND reward_action = :reward_action""").bindparams(user_id=filterDict['user_id'], reward_action="Winner")
    myBadgesResult = db.session.execute(myBadgesQuery)
    myBadgesMap = []
    for badge in myBadgesResult:
        myBadgesMap.append({"topic_id": badge.topic_id,
                               "reward_title": badge.reward_title,
                               "reward_badge": badge.reward_badge,
                               "reward_alloc_date": badge.reward_alloc_date})
    return myBadgesMap

def leaderBoard():
    leader_board_query = text("""SELECT 
    *,
    (@rank:=CASE
        WHEN @cnt = dot_coins THEN @rank
        WHEN (@cnt:=dot_coins) IS NOT NULL THEN @rank + 1
    END) * 1 ranking
FROM
    (SELECT 
    user_id,
    avatar_image_file,
    user_email,
    display_name,
    SUM(dot_coins) dot_coins,
    SUM(badges) badges,
    SUM(solo_count) AS solo_count,
    SUM(group_count) AS group_count
FROM
    leader_board_view
    GROUP BY user_id , avatar_image_file , user_email , display_name) tbl_dot_coins,
    (SELECT @rank:=0) r
ORDER BY dot_coins DESC , badges DESC , group_count DESC , solo_count DESC
LIMIT 10""").bindparams()
    leaderBoardResult = db.session.execute(leader_board_query)
    leaderBoardMap = []
    for lbr in leaderBoardResult:
        leaderBoardMap.append({"display_name":lbr.display_name,
                               "avatar_image_file": lbr.avatar_image_file,
                               "user_email": lbr.user_email,
                               "user_id": str(lbr.user_id),
                               "dot_coins": str(lbr.dot_coins),
                               "badges": str(lbr.badges),
                               "solo_count": str(lbr.solo_count),
                               "group_count": str(lbr.group_count),
                               "rank":str(lbr.ranking)})
    return leaderBoardMap


def dotAchievements(filterDict):
    achievements_query = text("""SELECT 
    dra.user_id,
    SUM(CASE
        WHEN reward_action = 'Winner' THEN reward_points
        ELSE 0
    END) winning_dot_coins,
    SUM(CASE
        WHEN reward_action = 'submit' THEN reward_points
        ELSE 0
    END) participation_dot_coins,
    SUM(CASE
        WHEN reward_action = 'Winner' THEN 1
        ELSE 0
    END) winning_badges_count,
    SUM(CASE
        WHEN reward_action = 'submit' THEN 1
        ELSE 0
    END) participation_count,
    SUM(reward_points) AS total_dot_coins,
    COUNT(1) AS total_challenges_count
FROM
    dot_reward_allocation dra
WHERE
    dra.user_id = ':user_id'
GROUP BY dra.user_id""").bindparams(user_id=filterDict['user_id'])
    achievementsResult = db.session.execute(achievements_query)
    achievementsMap = []
    for ach in achievementsResult:
        achievementsMap.append({"total_challenges_count": str(ach.total_challenges_count),
                               "total_dot_coins": str(ach.total_dot_coins),
                               "winning_dot_coins": str(ach.winning_dot_coins),
                               "participation_dot_coins": str(ach.participation_dot_coins),
                               "winning_badges_count": str(ach.winning_badges_count),
                               "participation_count": str(ach.participation_count)})
    return achievementsMap