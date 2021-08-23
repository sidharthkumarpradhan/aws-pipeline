from flask import current_app

from website.model_dir.dot_topic_assignments import DotTopicAssignments
from website.model_dir.dot_topic_group_roles import DotTopicGroupRoles
from website.service_dir.dot_email_notifications import sendEmail
from website.utils_dir.common_utils import getSort
from sqlalchemy import or_, null, and_, func, text
from website.model_dir.base_model import db
from authlib.integrations.flask_oauth2 import current_token
from datetime import datetime

def createDotTopicGroupRoles(roles):
    topic_id = roles['topic_id']
    group_id = roles['group']
    userId = current_token.user.id
    joincode_id = null()
    dotTopicGroupRoles = DotTopicGroupRoles()
    dotTopicGroupRoles.group_id = roles["group"]
    dotTopicGroupRoles.role_id = roles["role"]
    dotTopicGroupRoles.role_name = roles["role_name"]
    dotTopicGroupRoles.role_avatar = roles["role_avatar"]
    dotTopicGroupRoles.role_assigned_to = roles["role_assigned_to"]
    dotTopicGroupRoles.user_id = current_token.user.id
    dotTopicGroupRoles.save()
    #Send Notification to Group creator
    return dotTopicGroupRoles


def updateDotTopicGroupRoles(dotTopicGroupRolesJson):
    dotTopicGroupRoles = DotTopicGroupRoles()
    dotTopicGroupRoles = dotTopicGroupRoles.as_model(dotTopicGroupRolesJson)
    dotTopicGroupRoles.update()
    return dotTopicGroupRoles


def findById(id):
    return DotTopicGroupRoles.query.get(id)


def findAll(page, per_page, sort_column):
    return DotTopicGroupRoles.query.order_by(getSort(sort_column)).paginate(page, per_page, error_out=False)


def findBy(**kwargs):
    condition_arr = []
    for col, val in kwargs.items():
        condition_arr.append(getattr(DotTopicGroupRoles, col).__eq__(f'{val}%'))
    condition = or_(*condition_arr)
    return DotTopicGroupRoles.query.filter(condition).all()


def importDotTopicGroupRoless(dotTopicGroupRolessJson):
    modelList = []
    for i in dotTopicGroupRolessJson:
        dotTopicGroupRoles = DotTopicGroupRoles()
        dotTopicGroupRoles = dotTopicGroupRoles.as_model(i)
        modelList.append(dotTopicGroupRoles)
    dotTopicGroupRoles = DotTopicGroupRoles()
    dotTopicGroupRoles.saveAll(modelList)


def deleteById(id):
    dotTopicGroupRoles = findById(id)
    dotTopicGroupRoles.delete()


def topicRoles(DotTopicRolesJson):
    group_id = DotTopicRolesJson["group_id"]
    topic_id = DotTopicRolesJson["topic_id"]
    t = text("""SELECT 
    dot_topic_roles.*, group_role_id, role_assigned_to, group_id, dot_user_details.user_id, 
    dot_user_details.display_name, dot_user_details.avatar_image_file 
FROM
    dot_topic_roles
        LEFT JOIN
    dot_topic_group_roles ON dot_topic_group_roles.role_id = dot_topic_roles.role_id
        AND group_id = ':group_id'
        Left JOIN
    dot_user_details on dot_user_details.user_email = dot_topic_group_roles.role_assigned_to 
        or dot_user_details.user_gmail = dot_topic_group_roles.role_assigned_to
WHERE
    topic_id = ':topic_id' """).bindparams(group_id=group_id, topic_id= topic_id)
    topicRoless = db.session.execute(t)
    return topicRoless


def groupMembers(group_id):
    t = text("""SELECT 
    ud.user_id,
    role_name,
    role_avatar,
    role_assigned_to,
    role_id,
    dot_topic_group_roles.group_id,
    group_name,
    group_owner,
    group_image,
    ta.topic_id,
    display_name,
    gender,
    school_name,
    class_details,
    avatar_image_file,
    user_email,
    user_gmail   
FROM
    dot_topic_assignments ta
        JOIN
	dot_topic_group tg on ta.group_id = tg.group_id
		JOin
    dot_user_details ud ON (ud.user_id = ta.user_id)
        left JOIN
    dot_topic_group_roles ON (role_assigned_to = ud.user_email
        OR role_assigned_to = ud.user_gmail) and ta.group_id = dot_topic_group_roles.group_id
WHERE
     ta.group_id = ':group_id' """).bindparams(group_id=group_id)
    dotGroupMemberss = db.session.execute(t)
    dotGroupMembersMap = []
    is_group_owner = False
    for dotGroupMember in dotGroupMemberss:
        if dotGroupMember.group_owner == dotGroupMember.user_email or dotGroupMember.group_owner == dotGroupMember.user_gmail:
            is_group_owner = True
        else:
            is_group_owner = False
        userEmail = ""
        if dotGroupMember.user_email is not None:
            userEmail = dotGroupMember.user_email
        if dotGroupMember.user_gmail is not None:
            userEmail = dotGroupMember.user_gmail
        dotGroupMembersMap.append({"user_id": dotGroupMember.user_id,
                                   "role_name": dotGroupMember.role_name,
                                   "role_avatar": dotGroupMember.role_avatar,
                                   "role_assigned_to": dotGroupMember.role_assigned_to,
                                   "role_id": dotGroupMember.role_id,
                                   "group_id": dotGroupMember.group_id,
                                   "group_name": dotGroupMember.group_name,
                                   "is_group_owner": is_group_owner,
                                   "group_image": dotGroupMember.group_image,
                                   "topic_id": dotGroupMember.topic_id,
                                   "display_name": dotGroupMember.display_name,
                                   "gender": dotGroupMember.gender,
                                   "school_name": dotGroupMember.school_name,
                                   "class_details": dotGroupMember.class_details,
                                   "avatar_image_file": dotGroupMember.avatar_image_file,
                                   "user_email": userEmail
                                   })
    return dotGroupMembersMap


def dotRejectOtherInvites(topic_id, group_id):
    dotOtherInvites = DotTopicAssignments.query.filter(and_(DotTopicAssignments.topic_id == topic_id, DotTopicAssignments.user_id == current_token.user.id, DotTopicAssignments.group_id != group_id)).all()
    for dotOtherInvite in dotOtherInvites:
        sendRejectNotification(dotOtherInvite)
        dotOtherInvite.delete()


def sendRejectNotification(dotOtherInvite):
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
    emailData = {}
    emailData['subject'] = "DotX JoinCodes to platform"
    emailData['to'] = dotOtherInvite.assigned_by
    emailData['SITEURL'] = current_app.config.get("SITEURL")
    emailData['DISPLAY_NAME'] = invited_by_display_name
    emailData['INVITE'] = dotOtherInvite.user.display_name
    emailData['GROUP_NAME'] = dotOtherInvite.group.group_name
    emailData['CHALLENGE_NAME'] = dotOtherInvite.topic.topic_name
    emailData['TYPE'] = 'reject_challenge_invite'
    sendEmail(emailData)
