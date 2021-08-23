from website.model_dir.dot_topic_group import DotTopicGroup
from website.model_dir.dot_topic_group_roles import DotTopicGroupRoles
from website.model_dir.dot_topic_assignments import DotTopicAssignments
from website.model_dir.dot_joincode_details import DotJoincodeDetails
from website.model_dir.dot_user_details import DotUserDetails
from website.model_dir.oauth_models import User
from website.utils_dir.common_utils import getSort
from website.service_dir.dot_user_details_service import createUser
from sqlalchemy import or_, null, and_, func, text
from authlib.integrations.flask_oauth2 import current_token
from datetime import datetime
from website.utils_dir.common_utils import ran_gen, my_dictionary
from werkzeug.security import generate_password_hash
from website.model_dir.base_model import db
from website.exceptions_dir.base_exceptions import BadRequest
from website.service_dir.dot_email_notifications import sendEmail



def createDotTopicGroup(dotTopicGroupJson):
    dotTopicGroup = DotTopicGroup()
    dotTopicGroup = dotTopicGroup.as_model(dotTopicGroupJson)
    dotTopicGroup.save()
    return dotTopicGroup


def updateDotTopicGroup(dotTopicGroupJson):
    dotTopicGroup = DotTopicGroup()
    dotTopicGroup = dotTopicGroup.as_model(dotTopicGroupJson)
    dotTopicGroup.update()
    return dotTopicGroup


def findById(id):
    return DotTopicGroup.query.get(id)


def findAll(page, per_page, sort_column):
    return DotTopicGroup.query.order_by(getSort(sort_column)).paginate()


def findBy(**kwargs):
    condition_arr = []
    for col, val in kwargs.items():
        condition_arr.append(getattr(DotTopicGroup, col).ilike(f'{val}%'))
    # dotUserDetailss = DotUserDetails.query.filter(DotUserDetails.user_id == current_token.user.id).first()
    # if dotUserDetailss.user_type == 'student':
    #     #condition_arr.append(DotTopicAssignments.user_id == current_token.user.id)
    #     condition_arr.append(DotTopicAssignments.group_id != null())
    condition = and_(*condition_arr)
    # if dotUserDetailss.user_type == 'student':
    #     return DotTopicGroup.query.join(DotTopicAssignments, and_(DotTopicAssignments.topic_id == DotTopicGroup.topic_id, DotTopicAssignments.group_id == DotTopicGroup.group_id)).filter((condition)).all()
    # else:
    return DotTopicGroup.query.filter(condition).all()



def importDotTopicGroups(dotTopicGroupsJson):
    modelList = []
    for i in dotTopicGroupsJson:
        dotTopicGroup = DotTopicGroup()
        dotTopicGroup = dotTopicGroup.as_model(i)
        modelList.append(dotTopicGroup)
    dotTopicGroup = DotTopicGroup()
    dotTopicGroup.saveAll(modelList)


def deleteById(id):
    dotTopicGroup = findById(id)
    dotTopicGroup.delete()


def checkGroupName(dotChallengeGroupJson):
    dotTopicGroup = DotTopicGroup()
    topic_id = dotChallengeGroupJson['topic_id']
    group_name = dotChallengeGroupJson['group_name']
    dotTopicGroupDup = DotTopicGroup.query.filter(
        and_(DotTopicGroup.topic_id == topic_id, DotTopicGroup.group_name == group_name)).first()
    if dotTopicGroupDup is not None:
        return False
    else:
        return True


def createChallengeGroup(dotChallengeGroupJson):
    dotTopicGroup = DotTopicGroup()
    topic_id = dotChallengeGroupJson['topic_id']
    group_name = dotChallengeGroupJson['group_name']
    dotTopicGroupDup = DotTopicGroup.query.filter(
        and_(DotTopicGroup.topic_id == topic_id, DotTopicGroup.group_name == group_name)).first()
    if dotTopicGroupDup is not None:
        error = "Group already exist"
        raise BadRequest(error)
    dotTopicGroup.topic_id = dotChallengeGroupJson['topic_id']
    dotTopicGroup.group_name = dotChallengeGroupJson['group_name']
    dotTopicGroup.final_submitted = 0
    dotTopicGroup.group_owner = current_token.user.username
    dotTopicGroup.save()
    group_id = dotTopicGroup.group_id
    for roles in dotChallengeGroupJson['roles']:
        dotTopicGroupRoles = DotTopicGroupRoles()
        dotTopicGroupRoles.group_id = group_id
        dotTopicGroupRoles.role_id = roles["role_id"]
        dotTopicGroupRoles.role_name = roles["role_name"]
        dotTopicGroupRoles.role_avatar = roles["role_avatar"]
        dotTopicGroupRoles.role_assigned_to = roles["role_assigned_to"]
        dotTopicGroupRoles.user_id = current_token.user.id
        dotTopicGroupRoles.save()
    dotChallengeGroupJson['group_id'] = group_id
    shareGroup(dotChallengeGroupJson)
    dotChallengeGroupObj = dotTopicGroup.as_dict()
    dotTopicAssignment = DotTopicAssignments.query.filter(and_(DotTopicAssignments.group_id == group_id, DotTopicAssignments.user_id == current_token.user.id, DotTopicAssignments.topic_id == topic_id)).first()
    dotChallengeGroupObj["topic_assign_id"] = dotTopicAssignment.topic_assign_id
    return dotChallengeGroupObj


def updateChallengeGroup(dotChallengeGroupJson):
    dotTopicGroup = DotTopicGroup()
    dotTopicGroup.group_id = dotChallengeGroupJson['group_id']
    dotTopicGroup.topic_id = dotChallengeGroupJson['topic_id']
    dotTopicGroup.group_name = dotChallengeGroupJson['group_name']
    dotTopicGroup.update()
    shareGroup(dotChallengeGroupJson)
    return dotTopicGroup


def groupAssignments(**kwargs):
    condition_arr = []
    for col, val in kwargs.items():
        condition_arr.append(getattr(DotTopicAssignments, col).__eq__(f'{val}%'))
    condition = or_(*condition_arr)
    return DotTopicAssignments.query.filter(condition).all()


def groupRoles(**kwargs):
    condition_arr = []
    for col, val in kwargs.items():
        condition_arr.append(getattr(DotTopicGroupRoles, col).__eq__(f'{val}%'))
    condition = or_(*condition_arr)
    return DotTopicGroupRoles.query.filter(condition).all()


def shareGroup(dotChallengeGroupJson):
    if "assignments" in dotChallengeGroupJson:
        topic_id = dotChallengeGroupJson['topic_id']
        group_id = dotChallengeGroupJson['group_id']
        existingIds = []
        for assignment in dotChallengeGroupJson['assignments']:
            dotchallengeAssigned = DotTopicAssignments.query.join(DotUserDetails, DotUserDetails.user_id==DotTopicAssignments.user_id).filter(and_(DotTopicAssignments.topic_id == topic_id), or_(DotUserDetails.user_email == assignment["user_email"],
                                                             DotUserDetails.user_gmail == assignment["user_email"]), DotTopicAssignments.group_id == group_id).first()
            if dotchallengeAssigned is None:
                dotUserDetails = DotUserDetails.query.filter(or_(DotUserDetails.user_email == assignment["user_email"],
                                                             DotUserDetails.user_gmail == assignment["user_email"])).first()
                if dotUserDetails is None:
                    userDetails = createUser(assignment["user_email"])
                    userId = userDetails["user_id"]
                    joincode_id = userDetails["joincode_id"]
                elif dotUserDetails.user_type == "admin":
                    continue
                else:
                    userId = dotUserDetails.user_id
                    joincode_id = null()
                dotTopicAssignments = DotTopicAssignments()
                dotTopicAssignments.user_id = userId
                dotTopicAssignments.topic_id = topic_id
                dotTopicAssignments.group_id = group_id
                dotTopicAssignments.joincode_id = joincode_id
                dotTopicAssignments.assignment_status = "Open"
                dotTopicAssignments.autoassign_flag = 1
                dotTopicAssignments.date_of_assignment = datetime.now().strftime('%Y-%m-%dT%H:%M:%S')
                dotTopicAssignments.assigned_by = current_token.user.username
                dotTopicAssignments.save()
                #send notification to user
                #sendGroupShareNotification(dotChallengeGroupJson)
                existingIds.append(dotTopicAssignments.topic_assign_id)
            else:
                existingIds.append(dotchallengeAssigned.topic_assign_id)
        dotTopicAssignmentsList = DotTopicAssignments.query.filter(and_(~DotTopicAssignments.topic_assign_id.in_(existingIds), DotTopicAssignments.assigned_by == current_token.user.username, DotTopicAssignments.topic_id == topic_id, DotTopicAssignments.group_id == group_id)).all()
        if dotTopicAssignmentsList is not None:
            for topicAssignment in dotTopicAssignmentsList:
                topicAssignment.delete()
        dotTopicAssignmentss = DotTopicAssignments.query.filter(DotTopicAssignments.user_id == current_token.user.id,
                                                                DotTopicAssignments.topic_id == topic_id,
                                                                DotTopicAssignments.group_id == group_id).first()
        if dotTopicAssignmentss is not None and dotTopicAssignmentss.autoassign_flag == 1:
            dotTopicAssignments = DotTopicAssignments()
            dotTopicAssignments.topic_assign_id = dotTopicAssignmentss.topic_assign_id
            dotTopicAssignments.autoassign_flag = 0
            dotTopicAssignments.update()
    else:
        error = "Please invite atlease a buddy"
        raise BadRequest(error)



def autoAssign(dotGroupJson):
    topic_id = dotGroupJson['topic_id']
    groupSize = int(dotGroupJson['topic_group_size']) - 1
    t = text("""SELECT 
    ud.*
FROM
    dot_user_details ud
        LEFT JOIN
    dot_topic_assignments ta ON ud.user_id = ta.user_id
        AND ta.user_id =  ':user_id' 
        AND topic_id =  ':topic_id' 
WHERE
    ta.topic_assign_id IS NULL and display_name is not null and ud.user_type = 'student' and ud.user_id <>""" + str(current_token.user.id) + """
ORDER BY RAND()
LIMIT  """ + str(groupSize)).bindparams(user_id=current_token.user.id, topic_id= topic_id)
    dotUserDetailss = db.session.execute(t)

    return dotUserDetailss
    # for dotUserDetails in dotUserDetailss:
    #     dotTopicAssignments = DotTopicAssignments()
    #     dotTopicAssignments.user_id = dotUserDetails.assign_id
    #     dotTopicAssignments.assignment_status = "Open"
    #     dotTopicAssignments.topic_id = topic_id
    #     dotTopicAssignments.group_id = group_id
    #     dotTopicAssignments.autoassign_flag = 0
    #     dotTopicAssignments.date_of_assignment = datetime.now().strftime('%Y-%m-%dT%H:%M:%S')
    #     dotTopicAssignments.assigned_by = current_token.user.username
    #     dotTopicAssignments.save()


def sendGroupShareNotification(dotOtherInvite):
    t = text("""SELECT 
    display_name
FROM
    dot_user_details
WHERE
    user_email = :user_email
        OR user_gmail = :user_email """).bindparams(user_email=dotOtherInvite.assigned_by)
    invited_by_details = db.session.execute(t)
    invited_by_display_name = None
    for invited_by_detail in invited_by_details:
        invited_by_display_name = invited_by_detail.display_name
	    #emailData = []
	    #emailData['subject'] = "DotX JoinCodes to platform"
	    #emailData['to'] = dotOtherInvite.assigned_by
	    #emailData['SITEURL'] = current_app.config.get("SITEURL")
	    #emailData['DISPLAY_NAME'] = invited_by_display_name
	    #emailData['INVITE'] = dotOtherInvite.user.display_name
	    #emailData['GROUP_NAME'] = dotOtherInvite.group.group_name
	    #emailData['CHALLENGE_NAME'] = dotOtherInvite.topic.topic_name
	    #emailData['TYPE'] = 'challenge_group_share'
	    #sendEmail(emailData)



