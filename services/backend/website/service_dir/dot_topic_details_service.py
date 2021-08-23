import json
from lib2to3.fixer_util import Dot

from flask import current_app

from website.model_dir.base_model import db
from website.model_dir.dot_topic_details import DotTopicDetails
from website.model_dir.dot_topic_group import DotTopicGroup
from website.model_dir.dot_topic_assignments import DotTopicAssignments
from website.model_dir.dot_topic_attachments import DotTopicAttachments
from website.model_dir.dot_user_details import DotUserDetails
from website.model_dir.dot_daily_dot import DotDailyDot
from website.model_dir.dot_topic_roles import DotTopicRoles
from website.model_dir.dot_daily_dot_records import DotDailyDotRecords
from website.service_dir.dot_email_notifications import sendEmail
from website.utils_dir.common_utils import getSort, ran_gen, my_dictionary
from website.service_dir.dot_user_details_service import createUser
from website.service_dir.dot_tags_service import createDotTags
from website.model_dir.dot_tags import DotTags
from website.model_dir.dot_tags_entity_rel import DotTagsEntityRel
from sqlalchemy import or_, and_, null, func, desc, text
from authlib.integrations.flask_oauth2 import current_token
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash
from website.model_dir.dot_reward_allocation import DotRewardAllocation
from website.model_dir.dot_reward_setup import DotRewardSetup


def createDotTopicDetails(dotTopicDetailsJson):
    dotTopicDetails = DotTopicDetails()
    dotTopicDetails = dotTopicDetails.as_model(dotTopicDetailsJson)
    dotTopicDetails.save()
    return dotTopicDetails


def updateDotTopicDetails(dotTopicDetailsJson):
    dotTopicDetails = DotTopicDetails()
    dotTopicDetails = dotTopicDetails.as_model(dotTopicDetailsJson)
    dotTopicDetails.update()
    return dotTopicDetails


def findById(id):
    return DotTopicDetails.query.get(id)


def findAll(page, per_page, sort_column):
    return DotTopicDetails.query.order_by(getSort(sort_column)).paginate(page, per_page, error_out=False)


def findBy(**kwargs):
    condition_arr = []
    for col, val in kwargs.items():
        condition_arr.append(getattr(DotTopicDetails, col).ilike(f'{val}%'))
    condition = or_(*condition_arr)
    return DotTopicDetails.query.filter(condition).order_by(getSort("created_date, desc")).all()



def importDotTopicDetailss(dotTopicDetailssJson):
    modelList = []
    for i in dotTopicDetailssJson:
        dotTopicDetails = DotTopicDetails()
        dotTopicDetails = dotTopicDetails.as_model(i)
        modelList.append(dotTopicDetails)
    dotTopicDetails = DotTopicDetails()
    dotTopicDetails.saveAll(modelList)


def deleteById(id):
    dotTopicDetails = findById(id)
    dotTopicDetails.delete()


def createChallengeDetails(dotChallengeJson):
    dotTopicDetails = DotTopicDetails()
    dotTopicDetails.topic_type = 'Challenge'
    dotTopicDetails.topic_name = dotChallengeJson['topic_name']
    dotTopicDetails.topic_description = dotChallengeJson['topic_description']
    dotTopicDetails.topic_earning_title = dotChallengeJson['topic_earning_title']
    dotTopicDetails.topic_dot_coins = dotChallengeJson['topic_dot_coins']
    dotTopicDetails.topic_earning_badge = dotChallengeJson['topic_earning_badge']
    dotTopicDetails.is_active = 1
    dotTopicDetails.is_spotlight = dotChallengeJson['is_spotlight']
    dotTopicDetails.topic_start_date = dotChallengeJson['topic_start_date']
    dotTopicDetails.topic_end_date = dotChallengeJson['topic_end_date']
    dotTopicDetails.topic_group_size = dotChallengeJson['topic_group_size']
    dotTopicDetails.topic_status = dotChallengeJson['topic_status'] if 'topic_status' in dotChallengeJson else "Draft"
    dotTopicDetails.participation_dot_coins = dotChallengeJson['participation_dot_coins'] if 'participation_dot_coins' in dotChallengeJson else 20
    dotTopicDetails.published_date = dotChallengeJson['published_date'] if 'published_date' in dotChallengeJson else None
    dotTopicDetails.is_influencer_challenge = dotChallengeJson['is_influencer_challenge'] if 'is_influencer_challenge' in dotChallengeJson else None
    dotTopicDetails.influencer_name = dotChallengeJson['influencer_name'] if 'influencer_name' in dotChallengeJson else ""
    dotTopicDetails.topic_level = dotChallengeJson['topic_level'] if 'topic_level' in dotChallengeJson else None
    dotTopicDetails.created_by = current_token.user.username
    dotTopicDetails.created_date = datetime.now().strftime('%Y-%m-%dT%H:%M:%S')
    dotTopicDetails.save()
    topic_id = dotTopicDetails.topic_id
    if dotChallengeJson['topic_document'] != "" :
        dotTopicAttachments = DotTopicAttachments()
        dotTopicAttachments.attachment_title = "challenge_document"
        dotTopicAttachments.attachment_file_path = dotChallengeJson['topic_document']
        dotTopicAttachments.topic_id = topic_id
        dotTopicAttachments.save()
    if dotChallengeJson['topic_audio'] != "" :
        dotTopicAttachments = DotTopicAttachments()
        dotTopicAttachments.attachment_title = "challenge_audio"
        dotTopicAttachments.attachment_file_path = dotChallengeJson['topic_audio']
        dotTopicAttachments.topic_id = topic_id
        dotTopicAttachments.save()
    if dotChallengeJson['topic_video'] != "" :
        dotTopicAttachments = DotTopicAttachments()
        dotTopicAttachments.attachment_title = "challenge_video"
        dotTopicAttachments.attachment_file_path = dotChallengeJson['topic_video']
        dotTopicAttachments.topic_id = topic_id
        dotTopicAttachments.save()
    if dotChallengeJson['topic_image'] != "" :
        dotTopicAttachments = DotTopicAttachments()
        dotTopicAttachments.attachment_title = "challenge_image"
        dotTopicAttachments.attachment_file_path = dotChallengeJson['topic_image']
        dotTopicAttachments.topic_id = topic_id
        dotTopicAttachments.save()
    createRoles(dotChallengeJson, topic_id)
    topicRoless = getTopicRoles(topic_id)
    tagChallenge(topic_id, dotChallengeJson)
    return dotTopicDetails


def updateChallengeDetails(dotChallengeJson):
    dotTopicDetails = DotTopicDetails()
    dotTopicDetails.topic_id = dotChallengeJson['topic_id']
    dotTopicDetails.topic_type = 'Challenge'
    if "topic_name" in dotChallengeJson:
        dotTopicDetails.topic_name = dotChallengeJson['topic_name']
    if "topic_description" in dotChallengeJson:
        dotTopicDetails.topic_description = dotChallengeJson['topic_description']
    if "topic_earning_title" in dotChallengeJson:
        dotTopicDetails.topic_earning_title = dotChallengeJson['topic_earning_title']
    if "topic_dot_coins" in dotChallengeJson:
        dotTopicDetails.topic_dot_coins = dotChallengeJson['topic_dot_coins']
    if "topic_earning_badge" in dotChallengeJson:
        dotTopicDetails.topic_earning_badge = dotChallengeJson['topic_earning_badge']
    if "topic_broadcast" in dotChallengeJson:
        dotTopicDetails.topic_broadcast = dotChallengeJson['topic_broadcast']
    if "is_spotlight" in dotChallengeJson:
        dotTopicDetails.is_spotlight = dotChallengeJson['is_spotlight']
    if "topic_start_date" in dotChallengeJson:
        dotTopicDetails.topic_start_date = dotChallengeJson['topic_start_date']
    if "topic_end_date" in dotChallengeJson:
        dotTopicDetails.topic_end_date = dotChallengeJson['topic_end_date']
    if "topic_group_size" in dotChallengeJson:
        dotTopicDetails.topic_group_size = dotChallengeJson['topic_group_size']
    if "is_influencer_challenge" in dotChallengeJson:
        dotTopicDetails.is_influencer_challenge = dotChallengeJson['is_influencer_challenge']
    if "influencer_name" in dotChallengeJson:
        dotTopicDetails.influencer_name = dotChallengeJson['influencer_name']
    if "published_date" in dotChallengeJson:
        dotTopicDetails.published_date = dotChallengeJson['published_date']
    if "topic_status" in dotChallengeJson:
        dotTopicDetails.topic_status = dotChallengeJson['topic_status']
    if "topic_level" in dotChallengeJson:
        dotTopicDetails.topic_level = dotChallengeJson['topic_level']
    dotTopicDetails.is_active = 1
    dotTopicDetails.update()
    topic_id = int(dotChallengeJson['topic_id'])
    if 'topic_document' in dotChallengeJson or 'topic_audio' in dotChallengeJson or 'topic_video' in dotChallengeJson or 'topic_image' in dotChallengeJson:
        dotTopicAttachmentsList = topicAttachments(topic_id=topic_id)
        for topicAttachment in dotTopicAttachmentsList:
            topicAttachment.delete()
    if 'topic_document' in dotChallengeJson and dotChallengeJson['topic_document'] != "" :
        dotTopicAttachments = DotTopicAttachments()
        dotTopicAttachments.attachment_title = "challenge_document"
        dotTopicAttachments.attachment_file_path = dotChallengeJson['topic_document']
        dotTopicAttachments.topic_id = topic_id
        dotTopicAttachments.save()
    if 'topic_audio' in dotChallengeJson and dotChallengeJson['topic_audio'] != "" :
        dotTopicAttachments = DotTopicAttachments()
        dotTopicAttachments.attachment_title = "challenge_audio"
        dotTopicAttachments.attachment_file_path = dotChallengeJson['topic_audio']
        dotTopicAttachments.topic_id = topic_id
        dotTopicAttachments.save()
    if 'topic_video' in dotChallengeJson and dotChallengeJson['topic_video'] != "" :
        dotTopicAttachments = DotTopicAttachments()
        dotTopicAttachments.attachment_title = "challenge_video"
        dotTopicAttachments.attachment_file_path = dotChallengeJson['topic_video']
        dotTopicAttachments.topic_id = topic_id
        dotTopicAttachments.save()
    if 'topic_image' in dotChallengeJson and dotChallengeJson['topic_image'] != "" :
        dotTopicAttachments = DotTopicAttachments()
        dotTopicAttachments.attachment_title = "challenge_image"
        dotTopicAttachments.attachment_file_path = dotChallengeJson['topic_image']
        dotTopicAttachments.topic_id = topic_id
        dotTopicAttachments.save()
    if dotChallengeJson['topic_group_size'] == 1:
        dotTopicRolesList = DotTopicRoles.query.filter(DotTopicRoles.topic_id == topic_id).all()
        for topicRole in dotTopicRolesList:
            topicRole.delete()
    elif "roles" in dotChallengeJson:
        topicRolesMap = []
        for role in dotChallengeJson["roles"]:
            if role['role_id'] != "":
                existingRole = DotTopicRoles.query.filter(DotTopicRoles.role_id == int(role['role_id'])).first()
                if existingRole is not None:
                    existingRole.role_name = role['role_name']
                    existingRole.role_img = role['role_img']
                    existingRole.update()
                    topicRolesMap.append(existingRole.role_id)
                else:
                    role['topic'] = dotTopicDetails.topic_id
                    role.pop("role_id")
                    dotTopicRole = DotTopicRoles()
                    dotTopicRole = dotTopicRole.as_model(role)
                    dotTopicRole.save()
                    topicRolesMap.append(dotTopicRole.role_id)
            else:
                role['topic'] = dotTopicDetails.topic_id
                role.pop("role_id")
                dotTopicRole = DotTopicRoles()
                dotTopicRole = dotTopicRole.as_model(role)
                dotTopicRole.save()
                topicRolesMap.append(dotTopicRole.role_id)
        dotTopicRolesDel = DotTopicRoles.query.filter(and_(DotTopicRoles.role_id.notin_(topicRolesMap), DotTopicRoles.topic_id == topic_id)).all()
        for delTopicRole in dotTopicRolesDel:
            delTopicRole.delete()
    tagChallenge(topic_id, dotChallengeJson)
    return dotTopicDetails


def tagChallenge(topic_id, dotChallengeJson):
    if "tags" in dotChallengeJson:
        deleteTagEntity = DotTagsEntityRel.query.filter(DotTagsEntityRel.entity_id == topic_id).delete()
        for tag in dotChallengeJson["tags"]:
            dotTags = DotTags.query.filter(DotTags.tag_name == tag["tag"]).first()
            if dotTags is None:
                dotTag = createDotTags({"tag_name" : tag["tag"]})
                tag_id = dotTag.tag_id
            else:
                tag_id = dotTags.tag_id
            dotTagsEntityRel = DotTagsEntityRel()
            dotTagsEntityRel.tag_id = tag_id
            dotTagsEntityRel.entity_id = topic_id
            dotTagsEntityRel.entity_type = "Challenge"
            dotTagsEntityRel.save()

def createRoles(dotChallengeJson, topic_id):
    if "roles" in dotChallengeJson:
        for role in dotChallengeJson['roles']:
            role.pop("role_id")
            role["topic"] = topic_id
            dotTopicRole = DotTopicRoles()
            dotTopicRole = dotTopicRole.as_model(role)
            dotTopicRole.save()


def getTopicRoles(topic_id):
    return DotTopicRoles.query.filter(DotTopicRoles.topic_id == topic_id).all()


def topicAssignments(topic_id):
    return DotTopicAssignments.query.filter(and_(DotTopicAssignments.topic_id == topic_id, DotTopicAssignments.group_id == null(), or_(DotTopicAssignments.assigned_by == current_token.user.username, DotTopicAssignments.user_id == current_token.user.id))).all()


def topicAttachments(**kwargs):
    condition_arr = []
    for col, val in kwargs.items():
        condition_arr.append(getattr(DotTopicAttachments, col).__eq__(f'{val}%'))
    condition = or_(*condition_arr)
    return DotTopicAttachments.query.filter(condition).all()


def userDetails(**kwargs):
    condition_arr = []
    for col, val in kwargs.items():
        condition_arr.append(getattr(DotUserDetails, col).__eq__(f'{val}%'))
    condition = or_(*condition_arr)
    return DotUserDetails.query.filter(condition).all()


def topicAssignmentsDetails(topic_id):
    dotTopicAssignmentsList = topicAssignments(topic_id)
    dotTopicAssignmentsMaps = []
    for dotTopicAssignments in dotTopicAssignmentsList:
        dotTopicAssignmentsMaps.append(dotTopicAssignments.as_dict())
    return dotTopicAssignmentsMaps


def shareChallenge(dotChallengeJson):
    if "assignments" in dotChallengeJson:
        existingIds = []
        for assignment in dotChallengeJson['assignments']:
            dotchallengeAssigned = DotTopicAssignments.query.join(DotUserDetails, DotUserDetails.user_id==DotTopicAssignments.user_id).filter(and_(DotTopicAssignments.topic_id == dotChallengeJson['topic_id']), or_(DotUserDetails.user_email == assignment["user_email"],
                                                             DotUserDetails.user_gmail == assignment["user_email"]), DotTopicAssignments.group_id == null(), DotTopicAssignments.assigned_by == current_token.user.username).first()
            if dotchallengeAssigned is None:
                dotUserDetails = DotUserDetails.query.filter(or_(DotUserDetails.user_email == assignment["user_email"],
                                                             DotUserDetails.user_gmail == assignment["user_email"])).first()
                if dotUserDetails is None:
                    dict_obj = createUser(assignment["user_email"])
                    userId = dict_obj.get('user_id')
                    joincode_id = dict_obj.get('joincode_id')
                elif dotUserDetails.user_type == "admin" or dotUserDetails.user_id == current_token.user.id:
                    continue
                else:
                    userId = dotUserDetails.user_id
                    joincode_id = null()
                topic_id = dotChallengeJson['topic_id']
                dotTopicAssignments = DotTopicAssignments()
                dotTopicAssignments.user_id = userId
                dotTopicAssignments.topic_id = topic_id
                dotTopicAssignments.joincode_id = joincode_id
                dotTopicAssignments.assignment_status = "Open"
                dotTopicAssignments.autoassign_flag = 1
                dotTopicAssignments.date_of_assignment = datetime.now().strftime('%Y-%m-%dT%H:%M:%S')
                dotTopicAssignments.assigned_by = current_token.user.username
                dotTopicAssignments.save()
                existingIds.append(dotTopicAssignments.topic_assign_id)
            else:
                existingIds.append(dotchallengeAssigned.topic_assign_id)
        dotTopicAssignmentsList = DotTopicAssignments.query.filter(and_(~DotTopicAssignments.topic_assign_id.in_(existingIds), DotTopicAssignments.group_id == null(), DotTopicAssignments.assigned_by == current_token.user.username, DotTopicAssignments.topic_id == dotChallengeJson['topic_id'])).all()
        if dotTopicAssignmentsList is not None:
            for topicAssignment in dotTopicAssignmentsList:
                topicAssignment.delete()
        dotTopicAssignmentss = DotTopicAssignments.query.filter(DotTopicAssignments.user_id == current_token.user.id,
                                                                DotTopicAssignments.topic_id == dotChallengeJson['topic_id'],
                                                                DotTopicAssignments.group_id == null()).first()
        if dotTopicAssignmentss is not None and dotTopicAssignmentss.autoassign_flag == 1:
            dotTopicAssignments = DotTopicAssignments()
            dotTopicAssignments.topic_assign_id = dotTopicAssignmentss.topic_assign_id
            dotTopicAssignments.autoassign_flag = 0
            dotTopicAssignments.update()
            dotRewardSetups = DotRewardSetup.query.filter(and_(DotRewardSetup.topic_id == topic_id, DotRewardSetup.reward_action=='Share')).first()
            if dotRewardSetups is not None:
                dotRewardAllocationss = DotRewardAllocation.query.filter(and_(DotRewardAllocation.topic_id == topic_id, DotRewardAllocation.user_id == current_token.user.id, DotRewardAllocation.reward_action == 'Share')).first()
                if dotRewardAllocationss is None:
                    dotRewardAllocations = DotRewardAllocation()
                    dotRewardAllocations.user_id = current_token.user.id
                    dotRewardAllocations.topic_id = topic_id
                    dotRewardAllocations.reward_points = dotRewardSetups.reward_points
                    dotRewardAllocations.reward_action = dotRewardSetups.reward_action
                    dotRewardAllocations.reward_title = dotRewardSetups.reward_title
                    dotRewardAllocations.reward_badge = dotRewardSetups.reward_badge
                    dotRewardAllocations.reward_alloc_date = datetime.now().strftime('%Y-%m-%dT%H:%M:%S')
                    dotRewardAllocations.save()


def QuestMap(id):
    dotTopic = DotTopicDetails.query.filter(DotTopicDetails.parent_topic_id == id).all()
    return dotTopic


def dateFilter(time_filter):
    days = 30
    if time_filter == "Last Week":
        days = 7
    if time_filter == "Last Month":
        days = 30
    if time_filter == "Last 3 Months":
        days = 90
    if time_filter == "Last 6 Months":
        days = 180
    return days


def challengeTop10(dottop10ChallengeJSON):
    time_filter = dottop10ChallengeJSON["time_filter"]
    days = dateFilter(time_filter)
    #where = " date(dtd.topic_start_date) >= DATE(NOW()) - INTERVAL "+str(days)+" DAY "
    t = text("""SELECT 
    dtd.*,
    topic_name,
    topic_group_size,
    challenge_count,
    CONCAT('[',
            GROUP_CONCAT(CONCAT('{"file":"',
                        attachment_file_path,
                        '", "type":"',
                        attachment_title,
                        '"}')),
            ']') attachments
FROM
    dot_topic_details dtd
        JOIN
    ((SELECT 
        topic_id, COUNT(topic_assign_id) challenge_count
    FROM
        dot_topic_assignments
    WHERE
        final_submitted = 1 AND group_id IS NULL
    GROUP BY topic_id) UNION (SELECT 
        topic_id, COUNT(group_id) challenge_count
    FROM
        dot_topic_group
    WHERE
        final_submitted = 1
    GROUP BY topic_id)) chc ON dtd.topic_id = chc.topic_id 
        LEFT JOIN
    dot_topic_attachments ta ON dtd.topic_id = ta.topic_id 
GROUP BY dtd.topic_id 
ORDER BY challenge_count DESC limit 10 """).bindparams()
    dotTopicDetailss = db.session.execute(t)
    dotTopicDetailsMaps = []
    dotTopicIds = []
    for dotTopicDetails in dotTopicDetailss:
        attachments = []
        if dotTopicDetails.attachments is not None:
            attachments = json.loads(dotTopicDetails.attachments)
        dotTopicDetailsMaps.append({"topic_id": dotTopicDetails.topic_id,
                                    "topic_type": dotTopicDetails.topic_type,
                                    "topic_name": dotTopicDetails.topic_name,
                                    "topic_description": dotTopicDetails.topic_description,
                                    "topic_duration": dotTopicDetails.topic_duration,
                                    "topic_earning_title": dotTopicDetails.topic_earning_title,
                                    "topic_earning_badge": dotTopicDetails.topic_earning_badge,
                                    "topic_dot_coins": dotTopicDetails.topic_dot_coins,
                                    "topic_status": dotTopicDetails.topic_status,
                                    "topic_level": dotTopicDetails.topic_level,
                                    "is_active": dotTopicDetails.is_active,
                                    "is_spotlight": dotTopicDetails.is_spotlight,
                                    "topic_start_date": dotTopicDetails.topic_start_date,
                                    "topic_end_date": dotTopicDetails.topic_end_date,
                                    "topic_group_size": dotTopicDetails.topic_group_size,
                                    "challenge_count": dotTopicDetails.challenge_count,
                                    "attachments": attachments})
    return dotTopicDetailsMaps


def ChallengeFeedback(topic_id):
    dotFeedback = DotTopicAssignments.query.with_entities(DotTopicAssignments.topic_id, DotTopicAssignments.assign_feedback_option,
                                                       func.count(DotTopicAssignments.assign_feedback_option).label(
                                                           "count_by_feedback")).filter(DotTopicAssignments.topic_id == topic_id and
        DotTopicAssignments.assign_feedback_option != null()).group_by(DotTopicAssignments.topic_id, DotTopicAssignments.assign_feedback_option).order_by(
        desc(func.count(DotTopicAssignments.assign_feedback_option))).all()
    return dotFeedback


def challengeTrend(dotTrendChallengeJSON):
    time_filter = dotTrendChallengeJSON["time_filter"]
    days = dateFilter(time_filter)
    where = ""
    where = " where topic_status = 'Open' "
    #where = " where date(dtd.topic_start_date) >= DATE(NOW()) - INTERVAL " + str(days) + " DAY "
    t = text("""SELECT 
        dtd.*,
        topic_name,
        topic_group_size,
        challenge_count,
        CONCAT('[',
                GROUP_CONCAT(CONCAT('{"file":"',
                            attachment_file_path,
                            '", "type":"',
                            attachment_title,
                            '"}')),
                ']') attachments
    FROM
        dot_topic_details dtd
            JOIN
        ((SELECT 
            topic_id, COUNT(topic_assign_id) challenge_count
        FROM
            dot_topic_assignments
        WHERE group_id IS NULL
        GROUP BY topic_id) UNION (SELECT 
            topic_id, COUNT(group_id) challenge_count
        FROM
            dot_topic_group 
        GROUP BY topic_id)) chc ON dtd.topic_id = chc.topic_id 
            LEFT JOIN
        dot_topic_attachments ta ON dtd.topic_id = ta.topic_id  """+where+"""
    GROUP BY dtd.topic_id
    ORDER BY challenge_count DESC""").bindparams()
    dotTopicDetailss = db.session.execute(t)
    dotTopicDetailsMaps = []
    dotTopicIds = []
    for dotTopicDetails in dotTopicDetailss:
        attachments = []
        if dotTopicDetails.attachments is not None:
            attachments = json.loads(dotTopicDetails.attachments)
        dotTopicDetailsMaps.append({"topic_id": dotTopicDetails.topic_id,
                                    "topic_type": dotTopicDetails.topic_type,
                                    "topic_name": dotTopicDetails.topic_name,
                                    "topic_description": dotTopicDetails.topic_description,
                                    "topic_duration": dotTopicDetails.topic_duration,
                                    "topic_earning_title": dotTopicDetails.topic_earning_title,
                                    "topic_earning_badge": dotTopicDetails.topic_earning_badge,
                                    "topic_dot_coins": dotTopicDetails.topic_dot_coins,
                                    "topic_status": dotTopicDetails.topic_status,
                                    "topic_level": dotTopicDetails.topic_level,
                                    "is_active": dotTopicDetails.is_active,
                                    "is_spotlight": dotTopicDetails.is_spotlight,
                                    "topic_start_date": dotTopicDetails.topic_start_date,
                                    "topic_end_date": dotTopicDetails.topic_end_date,
                                    "topic_group_size": dotTopicDetails.topic_group_size,
                                    "challenge_count": dotTopicDetails.challenge_count,
                                    "attachments": attachments})
    return dotTopicDetailsMaps


def watchAgain():
    dotTopic = DotTopicAssignments.query().filter(DotTopicAssignments.user_id == current_token.user.id, DotTopicAssignments.assignment_status == "Completed").order_by(desc(DotTopicAssignments.lastmodified_date)).limit(10).all()
    return dotTopic


def challengeAssigned(topic_id):
    dotTopic = DotTopicAssignments.query.filter(DotTopicAssignments.user_id == current_token.user.id , DotTopicAssignments.topic_id==topic_id).first()
    return dotTopic


def autoAssign(topic_id):
    TopicAssignmentss = topicAssignments(topic_id)
    dotTopicDetailss = findById(topic_id)
    limit = 4
    if len(TopicAssignmentss) < 4:
        limit = limit - len(TopicAssignmentss)
    dotUserDetailss = DotUserDetails.query.join(DotTopicAssignments, and_(DotTopicAssignments.user_id==DotUserDetails.user_id, DotTopicAssignments.topic_id == topic_id), isouter=True).filter(DotTopicAssignments.topic_assign_id == null()).order_by(func.rand()).limit(limit).all()
    for dotUserDetails in dotUserDetailss:
        dotTopicAssignments = DotTopicAssignments()
        dotTopicAssignments.user_id = dotUserDetails.user_id
        dotTopicAssignments.assignment_status = "Open"
        dotTopicAssignments.topic_id = topic_id
        dotTopicAssignments.autoassign_flag = 1
        dotTopicAssignments.date_of_assignment = datetime.now().strftime('%Y-%m-%dT%H:%M:%S')
        dotTopicAssignments.assigned_by = current_token.user.username
        dotTopicAssignments.save()
        emailData = {}
        emailData['subject'] = "DotX Challenge"
        emailData['to'] = dotUserDetails.user_email
        emailData['SITEURL'] = current_app.config.get("SITEURL")
        emailData['DISPLAYNAME'] = dotUserDetails.display_name
        emailData['CHALLENGENAME'] = dotTopicDetailss.topic_name
        emailData['CHALLENGEDESC'] = dotTopicDetailss.topic_description
        emailData['TYPE'] = 'challenge_share'
        sendEmail(emailData)
    dotTopicAssignmentss = DotTopicAssignments.query.filter(DotTopicAssignments.user_id == current_token.user.id, DotTopicAssignments.topic_id == topic_id, DotTopicAssignments.group_id == null()).first()
    dotTopicAssignments = DotTopicAssignments()
    dotTopicAssignments.topic_assign_id = dotTopicAssignmentss.topic_assign_id
    dotTopicAssignments.autoassign_flag = 0
    dotTopicAssignments.update()
    return dotTopicAssignments


def dotChallenges():
    dotChallenge = DotTopicAssignments.query.with_entities(DotTopicAssignments.topic_id, func.count(DotTopicAssignments.topic_assign_id)).join(DotTopicDetails, DotTopicDetails.topic_id == DotTopicAssignments.topic_id).filter(and_(DotTopicAssignments.user_id == current_token.user.id, DotTopicDetails.topic_type == 'Challenge', DotTopicAssignments.assignment_status.in_(['Open', 'In Progress']))).group_by(DotTopicAssignments.topic_id).count()
    return dotChallenge


def dotQuests():
    dotQuest = DotTopicAssignments.query.join(DotTopicDetails, DotTopicDetails.topic_id == DotTopicAssignments.topic_id).filter(and_(DotTopicAssignments.user_id == current_token.user.id, DotTopicDetails.topic_type == 'Quest')).count()
    return dotQuest


def dotDailyDots():
    dotDailyDot = DotDailyDotRecords.query.filter(and_(DotDailyDotRecords.record_response != null(), DotDailyDotRecords.user_id == current_token.user.id, func.date(DotDailyDotRecords.record_date) == func.curdate())).count()
    return dotDailyDot


def findAllBy(**kwargs):
    condition_arr = []
    for col, val in kwargs.items():
        condition_arr.append(getattr(DotTopicDetails, col).ilike(f'{val}%'))
    condition = or_(*condition_arr)
    return DotTopicDetails.query.filter(condition).order_by(getSort("created_date, desc")).all()


def topicAttachments(topic_id):
    return DotTopicAttachments.query.filter(DotTopicAttachments.topic_id == topic_id).all()


def topicDetailsById(topic_id):
    t = text("""SELECT
        dot_topic_details.*, 
        topic_assign_id, 
        assignment_status, 
        date_of_assignment, 
        assign_feedback_option, 
        assign_feedback_notes,
        group_role_id,
        role_id,
        role_name,
        role_avatar,
        role_assigned_to,
        group_id,
        final_submitted,
        display_name,
        avatar_image_file,
        school_name,
        class_details,
        user_id

    FROM
        dot_topic_details 
            left JOIN
        (select ta.topic_id, topic_assign_id, 
        assignment_status, 
        date_of_assignment, 
        assign_feedback_option, 
        assign_feedback_notes,
        group_role_id,
        role_id,
        role_name,
        role_avatar,
        role_assigned_to,
        ta.group_id,
        ud.user_id,
        ud.display_name,
        avatar_image_file,
        school_name,
        class_details,       
        tg.final_submitted from dot_topic_group tg 
             JOIN
        dot_topic_assignments ta  on tg.group_id = ta.group_id
            AND ta.user_id = ':user_id'
            LEFT JOIN
        dot_user_details ud ON ta.user_id = ud.user_id
            LEFT JOIN
        dot_topic_group_roles tgr ON ta.group_id = tgr.group_id and (tgr.role_assigned_to = ud.user_email
            OR tgr.role_assigned_to = ud.user_gmail)) t on t.topic_id = dot_topic_details.topic_id
    WHERE
        dot_topic_details.topic_id = ':topic_id' """).bindparams(user_id=current_token.user.id, topic_id=int(topic_id))
    dotTopic = db.session.execute(t)
    return dotTopic


def joinSoloChallenge(dotSoloChallengeJSON):
    topic_id = dotSoloChallengeJSON["topic_id"]
    dotTopicAssignments = DotTopicAssignments()
    dotTopicAssignments.user_id = current_token.user.id
    dotTopicAssignments.assignment_status = "Open"
    dotTopicAssignments.topic_id = topic_id
    dotTopicAssignments.autoassign_flag = 1
    dotTopicAssignments.date_of_assignment = datetime.now().strftime('%Y-%m-%dT%H:%M:%S')
    dotTopicAssignments.assigned_by = current_token.user.username
    dotTopicAssignments.save()
    return dotTopicAssignments


def topicAssignmentByUser(topic_id):
    return DotTopicAssignments.query.filter(and_(DotTopicAssignments.topic_id == topic_id, DotTopicAssignments.user_id == current_token.user.id)).first()


def getchallengeslist(where, limit="", orderBy = ""):
    t = text("""SELECT
        dtd.*, 
        t.topic_assign_id, 
        assignment_status, 
        date_of_assignment, 
        assign_feedback_option, 
        assign_feedback_notes,
        group_role_id,
        role_id,
        role_name,
        role_avatar,
        role_assigned_to,
        group_id,
        final_submitted,
        concat('[',group_concat(CONCAT('{"file":"', ta.attachment_file_path, '", "type":"',ta.attachment_title,'"}')),']')  attachments

    FROM
        dot_topic_details dtd
            left JOIN
        (select ta.topic_id, ta.topic_assign_id, 
        assignment_status, 
        date_of_assignment, 
        assign_feedback_option, 
        assign_feedback_notes,
        group_role_id,
        role_id,
        role_name,
        role_avatar,
        role_assigned_to,
        ta.group_id,
        ta.final_submitted 
            from 
        -- dot_topic_group tg 
             -- JOIN
        dot_topic_assignments ta  -- on tg.group_id = ta.group_id

            LEFT JOIN
        dot_user_details ud ON ta.user_id = ud.user_id
            LEFT JOIN
        dot_topic_group_roles tgr ON ta.group_id = tgr.group_id and (tgr.role_assigned_to = ud.user_email
            OR tgr.role_assigned_to = ud.user_gmail) where ta.user_id = ':user_id') t on t.topic_id = dtd.topic_id
            LEFT JOIN
        dot_topic_attachments ta on dtd.topic_id = ta.topic_id 
            left join
        dot_topic_response tr on tr.topic_assign_id = t.topic_assign_id

    WHERE """ + where + """ group by dtd.topic_id """ + orderBy + limit).bindparams(
        user_id=current_token.user.id )
    dotTopicDetailss = db.session.execute(t)
    dotTopicDetailsMaps = []
    dotTopicIds = []
    for dotTopicDetails in dotTopicDetailss:
        attachments = []
        if dotTopicDetails.attachments is not None:
            attachments = json.loads(dotTopicDetails.attachments)
        dotTopicDetailsMaps.append({"topic_id": dotTopicDetails.topic_id,
                                    "topic_type": dotTopicDetails.topic_type,
                                    "topic_name": dotTopicDetails.topic_name,
                                    "topic_description": dotTopicDetails.topic_description,
                                    "topic_duration": dotTopicDetails.topic_duration,
                                    "topic_earning_title": dotTopicDetails.topic_earning_title,
                                    "topic_earning_badge": dotTopicDetails.topic_earning_badge,
                                    "topic_dot_coins": dotTopicDetails.topic_dot_coins,
                                    "topic_status": dotTopicDetails.topic_status,
                                    "topic_level": dotTopicDetails.topic_level,
                                    "is_active": dotTopicDetails.is_active,
                                    "is_spotlight": dotTopicDetails.is_spotlight,
                                    "topic_start_date": dotTopicDetails.topic_start_date,
                                    "topic_end_date": dotTopicDetails.topic_end_date,
                                    "topic_group_size": dotTopicDetails.topic_group_size,
                                    "topic_assign_id": dotTopicDetails.topic_assign_id,
                                    "assignment_status": dotTopicDetails.assignment_status,
                                    "date_of_assignment": dotTopicDetails.date_of_assignment,
                                    "date_of_submission": dotTopicDetails.date_of_assignment,
                                    "assign_feedback_option": dotTopicDetails.assign_feedback_option,
                                    "assign_feedback_notes": dotTopicDetails.assign_feedback_notes,
                                    "group_role_id": dotTopicDetails.group_role_id,
                                    "group_id": dotTopicDetails.group_id,
                                    "final_submitted": dotTopicDetails.final_submitted,
                                    "role_id": dotTopicDetails.role_id,
                                    "role_name": dotTopicDetails.role_name,
                                    "role_avatar": dotTopicDetails.role_avatar,
                                    "role_assigned_to": dotTopicDetails.role_assigned_to,
                                    "attachments": attachments})
    return dotTopicDetailsMaps


def getChallengeTags(topic_id):
    tags = DotTagsEntityRel.query.filter(DotTagsEntityRel.entity_id == topic_id and DotTagsEntityRel.entity_type == "Challenge").all()
    tagsMap = []
    for tag in tags:
        tagsMap.append({"tag": tag.tag.tag_name})
    return tagsMap


def searchChallenges(dotTopicSearchJSON):
    where = ""
    if dotTopicSearchJSON["search_type"] == "buddy_name":
        where = " display_name like '%" + dotTopicSearchJSON["keyword"] + "%' "
    if dotTopicSearchJSON["search_type"] == "group":
        where = " group_name like '%" + dotTopicSearchJSON["keyword"] + "%' "
    if dotTopicSearchJSON["search_type"] == "topic_name":
        where = " topic_name like '%" + dotTopicSearchJSON["keyword"] + "%' or tag_name like '%" + dotTopicSearchJSON["keyword"] + "%' "
    t = text("""SELECT 
    *
FROM
    dot_topic_details td
        left JOIN
    dot_tags_entity_rel ter ON entity_id = td.topic_id
        AND entity_type = 'Challenge'
        left JOIN
    dot_tags tag ON ter.tag_id = tag.tag_id
        left JOIN
    dot_topic_attachments ta ON td.topic_id = ta.topic_id
        AND attachment_title = 'challenge_image'
        left join 
    dot_topic_group tg on tg.topic_id = td.topic_id
        left join
    dot_topic_assignments tas on tas.topic_id = td.topic_id
        left join
    dot_user_details ud on ud.user_id = tas.user_id
WHERE""" + where + """ group by td.topic_id """).bindparams()
    dotTopicdetails = db.session.execute(t)
    dotTopicDetailsMaps = []
    for topicdetails in dotTopicdetails:
        dotTopicDetailsMaps.append({"topic_id": topicdetails.topic_id,
                                    "topic_name": topicdetails.topic_name,
                                    "topic_end_date": topicdetails.topic_end_date,
                                    "topic_description": topicdetails.topic_description,
                                    "attachment_file_path": topicdetails.attachment_file_path,
                                    "attachment_title": topicdetails.attachment_title})
    return dotTopicDetailsMaps


def challengeInvititations(topic_id):
    t = text("""SELECT 
    tg.group_id,
    tg.group_name,
    ta.topic_assign_id,
    CONCAT('{"user_id":"',
            ud1.user_id,
            '","display_name":"',
            ud1.display_name,
            '","avatar_image_file":"',
            ud1.avatar_image_file,
            '","class_details":"',
            ud1.class_details,
            '","school_name":"',
            ud1.school_name,
            '","user_dob":"',
            ud1.user_dob,
            '"}') invited_by,
    CONCAT('[',
            GROUP_CONCAT(CONCAT('{"user_id":"',
                        ud.user_id,
                        '","display_name":"',
                        ud.display_name,
                        '","avatar_image_file":"',
                        ud.avatar_image_file,
                        '","role_id":"',
                        COALESCE(role_id, 'NULL'),
                        '","role_name":"',
                        COALESCE(role_name, 'NULL'),
                        '","role_avatar":"',
                        COALESCE(role_avatar, 'NULL'),
                        '","role_assigned_to":"',
                        COALESCE(role_assigned_to, 'NULL'),
                        '","group_role_id":"',
                        COALESCE(group_role_id, 'NULL'),
                        '"}')),
            ']') AS group_members
FROM
    dot_topic_assignments ta
        JOIN
    dot_topic_group tg ON ta.group_id = tg.group_id
        JOIN
    dot_user_details ud ON (ud.user_id = ta.user_id)
        LEFT JOIN
    dot_topic_group_roles ON (role_assigned_to = ud.user_email
        OR role_assigned_to = ud.user_gmail)
        AND ta.group_id = dot_topic_group_roles.group_id
        LEFT JOIN
    dot_user_details ud1 ON ud1.user_email = tg.group_owner
WHERE
    tg.group_id IN (SELECT 
            tg1.group_id
        FROM
            dot_topic_assignments ta1
                JOIN
            dot_topic_group tg1 ON tg1.group_id = ta1.group_id
                AND ta1.user_id = ':user_id'
                AND tg1.topic_id = ':topic_id')
GROUP BY tg.group_id""").bindparams(user_id=current_token.user.id, topic_id=int(topic_id))
    dotTopicInvitations = db.session.execute(t)
    return dotTopicInvitations


def continueChallenges(dotContinueChallengeJSON):
    #time_filter = dotContinueChallengeJSON["time_filter"]
    #days = dateFilter(time_filter)
    #period_where = " date(dtd.topic_start_date) >= DATE(NOW()) - INTERVAL " + str(days) + " DAY "
    where = """ topic_status = 'Open' and date(topic_start_date) <= curdate() and date(topic_end_date) >= curdate() and t.topic_assign_id is not null and final_submitted is null  """
    limit = ""
    orderBy = " order by topic_end_date asc "
    dotTopicDetailsMaps = getchallengeslist(where, limit, orderBy)
    #dotTopicDetailss = cards(where, orderBy, limit)
    #dotTopicDetailsMaps = buildTopicDetailsJson(dotTopicDetailss)
    return dotTopicDetailsMaps


def recentChallenges(dotChallengeJSON):
    time_filter = dotChallengeJSON["time_filter"]
    days = dateFilter(time_filter)
    period_where = " date(dtd.topic_start_date) >= DATE(NOW()) - INTERVAL " + str(days) + " DAY "
    where = """ date(topic_start_date) <= curdate() 
                    and date(topic_end_date) >= curdate() and t.topic_assign_id is null and """ + period_where
    limit = ""
    orderBy = " order by topic_start_date desc "
    dotTopicDetailsMaps = getchallengeslist(where, limit, orderBy)
    return dotTopicDetailsMaps


def spotlightChallenges():
    where = """ dtd.is_spotlight = '1' and date(topic_start_date) <= curdate() and date(topic_end_date) >= curdate() and topic_status = 'Open' """
    limit = " limit 5 "
    orderBy = " order by topic_start_date desc "
    dotTopicDetailsMaps = getchallengeslist(where, limit, orderBy)
    return dotTopicDetailsMaps

def soloChallenges(dotSoloChallengeJSON):
    time_filter = ""
    if "time_filter" in dotSoloChallengeJSON and dotSoloChallengeJSON["time_filter"] is not None:
        time_filter = " and date(dtd.created_date) >= DATE(NOW()) - INTERVAL 7 DAY "
    where = """ topic_group_size = 1  and date(topic_start_date) <= curdate() and date(topic_end_date) >= curdate()""" + time_filter
    limit = ""
    dotTopicDetailsMaps = getchallengeslist(where, limit)
    return dotTopicDetailsMaps


def upcomingChallenges(dotMyChallengeJSON):
    where= "  published_date <= curdate()  and topic_start_date > curdate() and topic_status = 'Open' "
    limit= ""
    orderBy = " order by topic_start_date desc"
    dotTopicDetailsMaps = getchallengeslist(where, limit, orderBy)
    return dotTopicDetailsMaps


def myChallenges(dotMyChallengeJSON):
    where = ""
    period_where = ""
    if 'time_filter' in dotMyChallengeJSON:
        time_filter = dotMyChallengeJSON["time_filter"]
        days = dateFilter(time_filter)
        #period_where = " date(tr.created_date) >= DATE(NOW()) - INTERVAL " + str(days) + " DAY "
        where = period_where + """ t.topic_assign_id is not null and """
    where += """  final_submitted = 1 """
    limit = ""
    orderBy = " order by tr.created_date desc "
    dotTopicDetailsMaps = getchallengeslist(where, limit, orderBy)
    return dotTopicDetailsMaps



def top10Responses():
    where = """ where date(topic_start_date) <= curdate() and date(reactions_end_date) >= curdate() and topic_status = 'Open' """
    where += """ and is_influencer_challenge is null or is_influencer_challenge <> 1  """
    limit = " limit 10  "
    orderBy = " ORDER BY votes DESC "
    dotTopicDetailss = stackedcards(where, orderBy, limit)
    dotTopicDetailsMaps = buildTopicDetailsJson(dotTopicDetailss)
    return dotTopicDetailsMaps


def influencerChallenges():
    where = """ where date(topic_start_date) <= curdate() and date(reactions_end_date) >= curdate() and topic_status = 'Open' """
        where += """ and is_influencer_challenge = '1' """
    limit = " limit 10  "
    orderBy = " ORDER BY votes DESC "
    dotTopicDetailss = stackedcards(where, orderBy, limit)
    dotTopicDetailsMaps = buildTopicDetailsJson(dotTopicDetailss)
    return dotTopicDetailsMaps


def stackedcards(where, orderBy, limit):
    t = text("""SELECT 
    tres.*,
    (creative + truth + fun) AS votes,
    CONCAT('[',
            GROUP_CONCAT(CONCAT('{"file":"',
                        ta1.attachment_file_path,
                        '", "type":"challenge_image"}')),
            ']') attachments
FROM
    (SELECT 
        td.*,
        ta.topic_assign_id,
            SUM(CASE
                WHEN rating_reaction = 'Creative' THEN 1
                ELSE 0
            END) AS creative,
            SUM(CASE
                WHEN rating_reaction = 'Truth' THEN 1
                ELSE 0
            END) AS truth,
            SUM(CASE
                WHEN rating_reaction = 'Fun' THEN 1
                ELSE 0
            END) AS fun
    FROM
        dot_topic_response tr
    JOIN dot_topic_assignments ta ON ta.topic_assign_id = tr.topic_assign_id
        AND tr.is_final_submit = 1
    JOIN dot_topic_details td ON td.topic_id = ta.topic_id
    LEFT JOIN dot_topic_resp_ratings trr ON trr.topic_response_id = tr.topic_response_id
    LEFT JOIN dot_topic_group tg ON tg.group_id = ta.group_id
    JOIN dot_user_details ud ON ud.user_id = ta.user_id
    """ + where +"""
    GROUP BY td.topic_id) tres
        LEFT JOIN
    dot_topic_attachments ta1 ON ta1.topic_id = tres.topic_id
        AND attachment_title = 'challenge_image'
GROUP BY tres.topic_id
"""+orderBy + limit).bindparams()
    dotTopicDetailss = db.session.execute(t)
    return dotTopicDetailss


def buildTopicDetailsJson(dotTopicDetailss):
    dotTopicDetailsMaps = []
    for dotTopicDetails in dotTopicDetailss:
        attachments = []
        if dotTopicDetails.attachments is not None:
            attachments = json.loads(dotTopicDetails.attachments)
        dotTopicDetailsMaps.append({"topic_id": dotTopicDetails.topic_id,
                                    "topic_type": dotTopicDetails.topic_type,
                                    "topic_name": dotTopicDetails.topic_name,
                                    "topic_description": dotTopicDetails.topic_description,
                                    "topic_duration": dotTopicDetails.topic_duration,
                                    "topic_earning_title": dotTopicDetails.topic_earning_title,
                                    "topic_earning_badge": dotTopicDetails.topic_earning_badge,
                                    "topic_dot_coins": dotTopicDetails.topic_dot_coins,
                                    "participation_dot_coins": dotTopicDetails.participation_dot_coins,
                                    "topic_status": dotTopicDetails.topic_status,
                                    "topic_level": dotTopicDetails.topic_level,
                                    "is_active": dotTopicDetails.is_active,
                                    "is_spotlight": dotTopicDetails.is_spotlight,
                                    "is_influencer_challenge": dotTopicDetails.is_influencer_challenge,
                                    "topic_start_date": dotTopicDetails.topic_start_date,
                                    "topic_end_date": dotTopicDetails.topic_end_date,
                                    "published_date": dotTopicDetails.published_date,
                                    "reactions_end_date": dotTopicDetails.reactions_end_date,
                                    "topic_group_size": dotTopicDetails.topic_group_size,
                                    "topic_assign_id": dotTopicDetails.topic_assign_id,
                                    "attachments": attachments,
                                    "creative": str(dotTopicDetails.creative),
                                    "truth": str(dotTopicDetails.truth),
                                    "fun": str(dotTopicDetails.fun),
                                    "votes": str(dotTopicDetails.votes),
                                    })
    return dotTopicDetailsMaps


def responseCards(topic_id):
    t = text("""SELECT 
    *,
    (creative + truth + fun) AS votes,
    CONCAT('[',
            GROUP_CONCAT(CONCAT('{"file":"',
                        tra.attachment_file_path,
                        '", "type":"',
                        file_type,
                        '"}')),
            ']') attachments
FROM
    (SELECT 
        tr.topic_response_id,
            ud.display_name,
            ud.avatar_image_file,
            ud.class_details,
            ud.gender,
            ud.school_name,
            tg.group_name,
            topic_group_size,
            response_description,
            date_of_response,
            topic_name,
            td.topic_id,
            SUM(CASE
                WHEN rating_reaction = 'Creative' THEN 1
                ELSE 0
            END) AS creative,
            SUM(CASE
                WHEN rating_reaction = 'Truth' THEN 1
                ELSE 0
            END) AS truth,
            SUM(CASE
                WHEN rating_reaction = 'Fun' THEN 1
                ELSE 0
            END) AS fun
    FROM
        dot_topic_response tr
    JOIN dot_topic_assignments ta ON ta.topic_assign_id = tr.topic_assign_id
        AND tr.is_final_submit = 1
    JOIN dot_topic_details td ON td.topic_id = ta.topic_id
    LEFT JOIN dot_topic_resp_ratings trr ON trr.topic_response_id = tr.topic_response_id
    LEFT JOIN dot_topic_group tg ON tg.group_id = ta.group_id
    JOIN dot_user_details ud ON ud.user_id = ta.user_id
    WHERE
        is_final_submit = 1
            AND td.topic_id = :topic_id
    GROUP BY tr.topic_response_id) tres
        LEFT JOIN
    dot_topic_resp_attachments tra ON tra.topic_response_id = tres.topic_response_id
        AND file_type = 'image'
GROUP BY tres.topic_response_id
ORDER BY votes DESC , date_of_response ASC
LIMIT 10 """).bindparams(topic_id=topic_id)
    dotTopicResponsess = db.session.execute(t)
    dotTopicResponseMaps = []
    for dotTopicResponse in dotTopicResponsess:
        attachments = []
        if dotTopicResponse.attachments is not None:
            attachments = json.loads(dotTopicResponse.attachments)
        dotTopicResponseMaps.append({"topic_id": dotTopicResponse.topic_id,
                                     "topic_name": dotTopicResponse.topic_name,
                                     "topic_group_size": dotTopicResponse.topic_group_size,
                                     "group_name": dotTopicResponse.group_name,
                                     "display_name": dotTopicResponse.display_name,
                                     "avatar_image_file": dotTopicResponse.avatar_image_file,
                                     "class_details": dotTopicResponse.class_details,
                                     "school_name": dotTopicResponse.school_name,
                                     "gender": dotTopicResponse.gender,
                                     "response_description": dotTopicResponse.response_description,
                                     "date_of_response": dotTopicResponse.date_of_response,
                                     "creative": int(dotTopicResponse.creative),
                                     "truth": int(dotTopicResponse.truth),
                                     "fun": int(dotTopicResponse.fun),
                                     "votes": int(dotTopicResponse.votes),
                                     "attachments": attachments})
    return dotTopicResponseMaps