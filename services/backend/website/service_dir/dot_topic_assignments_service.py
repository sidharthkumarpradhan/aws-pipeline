from authlib.integrations.flask_oauth2 import current_token

from website.model_dir.dot_topic_assignments import DotTopicAssignments
from website.model_dir.dot_reward_setup import DotRewardSetup
from website.model_dir.dot_reward_allocation import DotRewardAllocation
from website.model_dir.dot_user_details import DotUserDetails
from website.model_dir.dot_skill_details import DotSkillDetails
from website.model_dir.dot_user_skills import DotUserSkills
from website.utils_dir.common_utils import getSort
from sqlalchemy import or_, and_, func, text
from datetime import datetime


def createDotTopicAssignments(dotTopicAssignmentsJson):
    dotTopicAssignments = DotTopicAssignments()
    dotTopicAssignments = dotTopicAssignments.as_model(dotTopicAssignmentsJson)
    dotTopicAssignments.save()
    return dotTopicAssignments


def updateDotTopicAssignments(dotTopicAssignmentsJson):
    dotTopicAssignments = DotTopicAssignments()
    dotTopicAssignments = dotTopicAssignments.as_model(dotTopicAssignmentsJson)
    dotTopicAssignments.update()
    return dotTopicAssignments


def findById(id):
    return DotTopicAssignments.query.get(id)


def findAll(page, per_page, sort_column):
    return DotTopicAssignments.query.order_by(getSort(sort_column)).paginate(page, per_page, error_out=False)


def findBy(**kwargs):
    condition_arr = []
    for col, val in kwargs.items():
        condition_arr.append(getattr(DotTopicAssignments, col).__eq__(f'{val}'))
    condition = or_(*condition_arr)
    return DotTopicAssignments.query.filter(condition).all()


def importDotTopicAssignmentss(dotTopicAssignmentssJson):
    modelList = []
    for i in dotTopicAssignmentssJson:
        dotTopicAssignments = DotTopicAssignments()
        dotTopicAssignments = dotTopicAssignments.as_model(i)
        modelList.append(dotTopicAssignments)
    dotTopicAssignments = DotTopicAssignments()
    dotTopicAssignments.saveAll(modelList)


def deleteById(id):
    dotTopicAssignments = findById(id)
    dotTopicAssignments.delete()


def buddySearch(searchJSON):
    filter = ""
    join = ""
    topic_id = searchJSON["topic_id"]
    if "school_name" in searchJSON:
        #filter = "dot_user_details.user_type = 'student' AND LOWER(dot_user_details.school_name) LIKE LOWER('"+searchJSON["school_name"]+"%') and ta.topic_assign_id is null"
        dotUserDetails = DotUserDetails.query.filter(and_(DotUserDetails.user_type == "student", getattr(DotUserDetails, "school_name").ilike(f'{searchJSON["school_name"]}%'))).all()
    if "class_details" in searchJSON:
        #filter = "dot_user_details.user_type = 'student' AND LOWER(dot_user_details.school_name) LIKE LOWER('" + searchJSON["class_details"] + "%') and ta.topic_assign_id is null"
        dotUserDetails = DotUserDetails.query.filter(and_(DotUserDetails.user_type == "student", getattr(DotUserDetails, "class_details").ilike(f'{searchJSON["class_details"]}%'))).all()
    if "display_name" in searchJSON:
        dotUserDetails = DotUserDetails.query.join(DotTopicAssignments, and_(DotTopicAssignments.user_id == DotUserDetails.user_id, DotTopicAssignments.topic_id == topic_id),  isouter=True).filter(and_(DotUserDetails.user_type == "student", getattr(DotUserDetails, "display_name").ilike(f'{searchJSON["display_name"]}%'), DotTopicAssignments.topic_assign_id == None)).all()
    if "skill" in searchJSON:
        #join = ""
        dotUserDetails = DotUserDetails.query.join(DotUserSkills, DotUserSkills.user_id == DotUserDetails.user_id).join(DotSkillDetails, DotSkillDetails.skill_id == DotUserSkills.skill_id).filter(and_(DotUserDetails.user_type == "student", getattr(DotSkillDetails, "skill_name").contains(f'{searchJSON["skill"]}%'))).all()
    if "age" in searchJSON:
        dotUserDetails = DotUserDetails.query.filter(and_(DotUserDetails.user_type == "student", func.floor(func.DATEDIFF( func.now(), DotUserDetails.user_dob)/365) == searchJSON["age"])).all()
    return dotUserDetails