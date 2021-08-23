from authlib.integrations.flask_oauth2 import current_token

from website.exceptions_dir.base_exceptions import BadRequest
from website.model_dir.base_model import db

from website.model_dir.dot_topic_response import DotTopicResponse
from website.model_dir.dot_topic_assignments import DotTopicAssignments
from website.model_dir.dot_topic_details import DotTopicDetails
from website.model_dir.dot_topic_resp_attachments import DotTopicRespAttachments
from website.model_dir.dot_topic_group import DotTopicGroup
from website.model_dir.dot_reward_allocation import DotRewardAllocation
from website.utils_dir.common_utils import getSort
from sqlalchemy import or_, null, and_, desc, text
from datetime import datetime


def createDotTopicResponse(dotTopicResponseJson):
    dotTopicResponse = DotTopicResponse()
    dotTopicResponse.response_description = dotTopicResponseJson["response_description"]
    dotTopicResponse.date_of_response = datetime.now().strftime('%Y-%m-%dT%H:%M:%S')
    dotTopicResponse.topic_assign_id = dotTopicResponseJson["topic_assign"]
    dotTopicAssignments = DotTopicAssignments.query.filter(DotTopicAssignments.topic_assign_id == dotTopicResponseJson["topic_assign"]).first()
    if "is_final_submit" in dotTopicResponseJson and dotTopicAssignments.final_submitted == 1:
        error = "Final response already submitted"
        raise BadRequest(error)
    if "is_final_submit" in dotTopicResponseJson:
        dotTopicResponse.is_final_submit = dotTopicResponseJson["is_final_submit"]
    else:
        dotTopicResponse.is_final_submit = 0
    dotTopicResponse.save()
    topic_response_id = dotTopicResponse.topic_response_id
    if dotTopicAssignments.group_id is not None:
        if "is_final_submit" in dotTopicResponseJson:
            dotTopicAssignment = DotTopicAssignments.query.filter(
                DotTopicAssignments.topic_assign_id == dotTopicResponseJson["topic_assign"]).first()
            dotTopicGroup = DotTopicGroup.query.filter(DotTopicGroup.group_id == dotTopicAssignment.group_id).first()
            dotTopicGroup.final_submitted = 1
            dotTopicGroup.update()
            group_id = dotTopicGroup.group_id
            t = text("""update dot_topic_assignments set final_submitted = 1 where group_id = ':group_id'""").bindparams(group_id = group_id)
            db.session.execute(t)
            db.session.commit()
            dotTopicAssignments = DotTopicAssignments.query.filter(DotTopicAssignments.group_id == group_id).all()
            for dotTopicAssignment in dotTopicAssignments:
                allocateSubmitDotCoins(dotTopicAssignment.user_id, dotTopicAssignment)
    else:
        if "is_final_submit" in dotTopicResponseJson:
            dotTopicAssignment = DotTopicAssignments.query.filter(
                DotTopicAssignments.topic_assign_id == dotTopicResponseJson["topic_assign"]).first()
            dotTopicAssignment.final_submitted = 1
            dotTopicAssignment.update()
            allocateSubmitDotCoins(current_token.user.id, dotTopicAssignment)

    if "attachments" in dotTopicResponseJson:
        for attachment in dotTopicResponseJson["attachments"]:
            dotTopicRespAttachment = DotTopicRespAttachments()
            dotTopicRespAttachment.topic_response_id = topic_response_id
            dotTopicRespAttachment.attachment_file_path = attachment["file"]
            dotTopicRespAttachment.file_type = attachment["type"]
            dotTopicRespAttachment.save()
    return dotTopicResponse


def allocateSubmitDotCoins(user_id, dotTopicAssignment):
    dotRewardAllocations = DotRewardAllocation()
    dotRewardAllocations.user_id = user_id
    dotRewardAllocations.topic_id = dotTopicAssignment.topic_id
    dotRewardAllocations.reward_points = 20
    dotRewardAllocations.reward_action = "Submit"
    dotRewardAllocations.reward_alloc_date = datetime.now().strftime('%Y-%m-%dT%H:%M:%S')
    dotRewardAllocations.save()


def updateDotTopicResponse(dotTopicResponseJson):
    dotTopicResponse = DotTopicResponse()
    dotTopicResponse = dotTopicResponse.as_model(dotTopicResponseJson)
    dotTopicResponse.update()
    return dotTopicResponse


def findById(id):
    return DotTopicResponse.query.get(id)


def findAll(page, per_page, sort_column):
    return DotTopicResponse.query.order_by(getSort(sort_column)).paginate(page, per_page, error_out=False)


def findBy(**kwargs):
    condition_arr = []
    for col, val in kwargs.items():
        condition_arr.append(getattr(DotTopicResponse, col).ilike(f'{val}%'))
    condition = or_(*condition_arr)
    return DotTopicResponse.query.filter(condition).all()


def importDotTopicResponses(dotTopicResponsesJson):
    modelList = []
    for i in dotTopicResponsesJson:
        dotTopicResponse = DotTopicResponse()
        dotTopicResponse = dotTopicResponse.as_model(i)
        modelList.append(dotTopicResponse)
    dotTopicResponse = DotTopicResponse()
    dotTopicResponse.saveAll(modelList)


def deleteById(id):
    dotTopicResponse = findById(id)
    dotTopicResponse.delete()


def challengeComments(topic_id):
    t = text("""SELECT
        tr2.topic_response_id,
        tr2.response_description,
        tr2.created_by,
        tr2.created_date,
        tr2.response_description,
        tr2.attachment_file_path,
        ud.display_name,
        ud.avatar_image_file,        
        COALESCE((SELECT 
                        SUM(CASE
                                WHEN trs.rating_value = 'Like' THEN 1
                                ELSE 0
                            END)
                    FROM
                        dot_topic_resp_ratings trs
                            LEFT JOIN
                        dot_topic_response tr ON trs.topic_response_id = tr.topic_response_id
                    WHERE
                        tr.topic_response_id = tr2.topic_response_id limit 1),
                0) AS likes_count,
        COALESCE((SELECT 
                        SUM(CASE
                                WHEN trs.rating_value = 'Dislike' THEN 1
                                ELSE 0
                            END)
                    FROM
                        dot_topic_resp_ratings trs
                            LEFT JOIN
                        dot_topic_response tr ON trs.topic_response_id = tr.topic_response_id
                    WHERE
                        tr.topic_response_id = tr2.topic_response_id limit 1),
                0) AS dislikes_count,
    
        (SELECT 
                rating_value
            FROM
                dot_topic_resp_ratings trs2
            WHERE
                trs2.topic_response_id = tr2.topic_response_id
                    AND user_id = ':user_id') AS comment_rating_value
    FROM
        dot_topic_response tr2
            JOIN
        dot_topic_assignments ta ON ta.topic_assign_id = tr2.topic_assign_id
            AND ta.topic_id = ':topic_id' and ta.group_id is null join dot_user_details ud on (ud.user_email = tr2.created_by or ud.user_gmail = tr2.created_by)
            order by tr2.created_date desc """).bindparams(user_id=current_token.user.id, topic_id=int(topic_id))
    dotTopic = db.session.execute(t)
    return dotTopic


def soloChallengeComments(topic_assign_id):
    t = text("""SELECT 
    tr2.topic_response_id,
    tr2.response_description,
    tr2.created_by,
    tr2.created_date,
    tr2.response_description,
    tr2.is_final_submit,
    ud.display_name,
    ud.avatar_image_file,
	concat('[',group_concat(CONCAT('{"file":"', tra.attachment_file_path, '", "type":"',tra.file_type,'"}')),']') attachments
FROM
    dot_topic_response tr2
        JOIN	
    dot_user_details ud ON (ud.user_email = tr2.created_by
        OR ud.user_gmail = tr2.created_by) 
        left join 
	dot_topic_resp_attachments  tra on tra.topic_response_id = tr2.topic_response_id 
        where tr2.topic_assign_id = ':topic_assign_id'
 group by tr2.topic_response_id ORDER BY tr2.created_date DESC """).bindparams(topic_assign_id = int(topic_assign_id))
    dotComments = db.session.execute(t)
    return dotComments


def groupComments(group_id):
    t = text("""SELECT 
    tr2.topic_response_id,
    tr2.response_description,
    tr2.created_by,
    tr2.created_date,
    tr2.response_description,
    tr2.is_final_submit,
    ud.display_name,
    ud.avatar_image_file,
    role_name,
    role_avatar
FROM
    dot_topic_response tr2
        JOIN
    dot_topic_assignments ta ON ta.topic_assign_id = tr2.topic_assign_id
        AND ta.group_id = ':group_id'
        JOIN
    dot_user_details ud ON (ud.user_email = tr2.created_by
        OR ud.user_gmail = tr2.created_by)
        JOIN
    dot_topic_group_roles ON (role_assigned_to = ud.user_email
        OR role_assigned_to = ud.user_gmail) and ta.group_id = dot_topic_group_roles.group_id
ORDER BY tr2.created_date DESC """).bindparams(group_id=int(group_id))
    dotGroupComments = db.session.execute(t)
    return dotGroupComments


def respAttachments(topic_resp_id):
    dotRespAttachments = DotTopicRespAttachments.query.filter(
        DotTopicRespAttachments.topic_response_id == topic_resp_id).all()
    return dotRespAttachments


def submittedChallengeResp(topic_id):
    t = text("""SELECT 
    tr2.topic_response_id,
    tr2.response_description,
    tr2.created_by,
    tr2.created_date,
    tr2.response_description,
    tr2.is_final_submit,
    ud.display_name,
    ud.avatar_image_file,
    role_name,
    role_avatar,
    tg.group_id,
    tg.group_name,
    sum(case when trr.rating_reaction = 'Creative' Then 1 else 0 end) as creative, 
    sum(case when trr.rating_reaction = 'Truth' Then 1 else 0 end) as truth, 
    sum(case when trr.rating_reaction = 'Fun' Then 1 else 0 end) as fun,
    CONCAT('[',
            GROUP_CONCAT(CONCAT('{"file":"',
                        tra.attachment_file_path,
                        '", "type":"',
                        tra.file_type,
                        '"}')),
            ']') attachments,
		trru.user_id,
        trru.topic_resp_rating_id,
        trru.rating_reaction,
        trru.rating_value
FROM
    dot_topic_response tr2
        JOIN
    dot_topic_assignments ta ON ta.topic_assign_id = tr2.topic_assign_id
        AND ta.topic_id = ':topic_id' and  tr2.is_final_submit = 1
        LEFT JOIN
    dot_topic_group tg ON tg.group_id = ta.group_id 
        JOIN
    dot_user_details ud ON (ud.user_email = tr2.created_by
        OR ud.user_gmail = tr2.created_by)
        LEFT JOIN
    dot_topic_group_roles ON (role_assigned_to = ud.user_email
        OR role_assigned_to = ud.user_gmail) and ta.group_id = dot_topic_group_roles.group_id
        left join 
	dot_topic_resp_ratings trr on trr.topic_response_id = tr2.topic_response_id 
        LEFT JOIN
    dot_topic_resp_attachments tra ON tra.topic_response_id = tr2.topic_response_id
	    LEFT JOIN
    dot_topic_resp_ratings trru ON trru.topic_response_id = tr2.topic_response_id and trru.user_id = ':user_id'
	
	group by topic_response_id
	
ORDER BY tr2.created_date DESC """).bindparams(topic_id=int(topic_id), user_id = current_token.user.id)
    dotGroupComments = db.session.execute(t)
    return dotGroupComments


def soloResponses(topic_id):
    t = text("""SELECT 
    tr.*,
    CONCAT('[',
            GROUP_CONCAT(CONCAT('{"file":"',
                        tra.attachment_file_path,
                        '", "type":"',
                        tra.file_type,
                        '"}')),
            ']') attachments
FROM
    (SELECT 
        tr2.topic_response_id,
            tr2.response_description,
            tr2.created_by,
            tr2.created_date,
            tr2.is_final_submit,
            ud.display_name,
            ud.avatar_image_file,
            ud.school_name,
            ud.class_details,
            SUM(CASE
                WHEN trr.rating_reaction = 'Creative' THEN 1
                ELSE 0
            END) AS creative,
            SUM(CASE
                WHEN trr.rating_reaction = 'Truth' THEN 1
                ELSE 0
            END) AS truth,
            SUM(CASE
                WHEN trr.rating_reaction = 'Fun' THEN 1
                ELSE 0
            END) AS fun,
            trru.user_id,
            trru.topic_resp_rating_id,
            trru.rating_reaction,
            trru.rating_value
    FROM
        dot_topic_response tr2
    JOIN dot_topic_assignments ta ON ta.topic_assign_id = tr2.topic_assign_id
        AND ta.topic_id = ':topic_id'
        AND tr2.is_final_submit = 1
    JOIN dot_user_details ud ON (ud.user_email = tr2.created_by
        OR ud.user_gmail = tr2.created_by)
    LEFT JOIN dot_topic_resp_ratings trr ON trr.topic_response_id = tr2.topic_response_id
    LEFT JOIN dot_topic_resp_ratings trru ON trru.topic_response_id = tr2.topic_response_id
        AND trru.user_id = ':user_id'
    GROUP BY topic_response_id) tr
        LEFT JOIN
    dot_topic_resp_attachments tra ON tra.topic_response_id = tr.topic_response_id GROUP BY tr.topic_response_id
ORDER BY tr.created_date DESC """).bindparams(topic_id=int(topic_id), user_id = current_token.user.id)
    dotComments = db.session.execute(t)
    return dotComments

