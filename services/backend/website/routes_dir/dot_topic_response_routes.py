import json

from flask import Blueprint, request
from flask import jsonify
from website.service_dir.dot_topic_response_service import createDotTopicResponse, updateDotTopicResponse
from website.service_dir.dot_topic_response_service import findAll, findById, findBy, groupComments, respAttachments
from website.service_dir.dot_topic_response_service import importDotTopicResponses, deleteById, challengeComments
from website.service_dir.dot_topic_response_service import submittedChallengeResp, soloChallengeComments, soloResponses
from website.service_dir.dot_topic_group_roles_service import groupMembers
from website.oauth2 import require_oauth
from website.model_dir.dot_topic_response import DotTopicResponse
from json import loads
import pandas as pd

bp = Blueprint(__name__, 'dotTopicResponse')


@bp.route('', methods=['POST', 'PUT', 'GET'])
@require_oauth()
def dotTopicResponseOps():
    dotTopicResponseObj = DotTopicResponse()
    if request.method == 'POST':
        dotTopicResponse = request.get_json(force=True)
        dotTopicResponseObj = createDotTopicResponse(dotTopicResponse)

    elif request.method == 'PUT':
        dotTopicResponse = request.get_json(force=True)
        dotTopicResponseObj = updateDotTopicResponse(dotTopicResponse)

    elif request.method == 'GET':
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        sort = request.args.get('sort', 'lastmodified_date,desc', type=str)
        dotTopicResponsePages = findAll(page, per_page, sort)
        dotTopicResponses = dotTopicResponsePages.items
        dotTopicResponseMaps = []
        for dotTopicResponse in dotTopicResponses:
            dotTopicResponseMaps.append(dotTopicResponse.as_dict())
        return jsonify(dotTopicResponseMaps), 200, {'X-Total-Count': dotTopicResponsePages.total}
    return jsonify(dotTopicResponseObj.as_dict())


@bp.route('/<id>',  methods=['GET'])
@require_oauth()
def findbyId(id):
    dotTopicResponse = findById(id)
    return jsonify(dotTopicResponse.as_dict())


@bp.route('/filter',  methods=['POST'])
@require_oauth()
def findbyFilter():
    filterDict = request.get_json(force=True)
    dotTopicResponses = findBy(**filterDict)
    dotTopicResponseMaps = []
    for dotTopicResponse in dotTopicResponses:
        dotTopicResponseMaps.append(dotTopicResponse.as_dict())
    return jsonify(dotTopicResponseMaps), 200, {'X-Total-Count': len(dotTopicResponses)}


@bp.route('/import',  methods=['POST'])
@require_oauth()
def importDotTopicResponsesRoute():
    csv_file = pd.DataFrame(pd.read_csv(request.files.get('file'),skiprows=1, sep=",", names=["email", "language", "location", "mobile", "name"], index_col=False))
    result = csv_file.to_json(orient="records")
    parsed = loads(result)
    importDotTopicResponses(parsed)
    return jsonify({"success": True})


@bp.route('/<id>',  methods=['DELETE'])
@require_oauth()
def deletebyId(id):
    deleteById(id)
    return jsonify({"success": True})



@bp.route('/group_comments/<group_id>',  methods=['GET'])
@require_oauth()
def group_comments(group_id):
    groupCommentss = groupComments(group_id)
    dotGroupCommentsMaps = []
    for comments in groupCommentss:
        attachmentsMap = []
        commentAttachmentss = respAttachments(comments.topic_response_id)
        for commentAttachments in commentAttachmentss:
            attachmentsMap.append({"type": commentAttachments.file_type ,"file":commentAttachments.attachment_file_path})
        dotGroupCommentsMaps.append({
                                    "response_description":comments.response_description,
                                    "created_by":comments.created_by,
                                    "created_date":comments.created_date,
                                    "display_name": comments.display_name,
                                    "avatar_image_file": comments.avatar_image_file,
                                    "topic_response_id": str(comments.topic_response_id),
                                    "role_name": str(comments.role_name),
                                    "is_final_submit": str(comments.is_final_submit),
                                    "role_avatar": str(comments.role_avatar),
                                    "attachments":attachmentsMap
                                   })
    return jsonify(dotGroupCommentsMaps)


@bp.route('/solo_challenge_notes/<topic_assign_id>',  methods=['GET'])
@require_oauth()
def solo_challenge_notes(topic_assign_id):
    challengeCommentss = soloChallengeComments(topic_assign_id)
    dotCommentsMaps = []
    for comments in challengeCommentss:
        attachments = []
        if comments.attachments is not None:
            attachments = json.loads(comments.attachments)
        dotCommentsMaps.append({
                                    "response_description": comments.response_description,
                                    "created_by": comments.created_by,
                                    "created_date": comments.created_date,
                                    "display_name": comments.display_name,
                                    "avatar_image_file": comments.avatar_image_file,
                                    "topic_response_id": str(comments.topic_response_id),
                                    "is_final_submit": str(comments.is_final_submit),
                                    "attachments": attachments
                                   })
    return jsonify(dotCommentsMaps)


@bp.route('/submitted_comments/<topic_id>',  methods=['GET'])
@require_oauth()
def submitted_comments(topic_id):
    groupCommentss = submittedChallengeResp(topic_id)
    dotGroupCommentsMaps = []
    for comments in groupCommentss:
        attachmentsMap = []
        commentAttachmentss = respAttachments(comments.topic_response_id)
        dotGroupMembersMap = groupMembers(comments.group_id)
        for commentAttachments in commentAttachmentss:
            attachmentsMap.append({"type": commentAttachments.file_type ,"file":commentAttachments.attachment_file_path})
        dotGroupCommentsMaps.append({
                                    "response_description":comments.response_description,
                                    "created_by":comments.created_by,
                                    "created_date":comments.created_date,
                                    "display_name": comments.display_name,
                                    "avatar_image_file": comments.avatar_image_file,
                                    "topic_response_id": str(comments.topic_response_id),
                                    "role_name": str(comments.role_name),
                                    "is_final_submit": str(comments.is_final_submit),
                                    "role_avatar": str(comments.role_avatar),
                                    "attachments":attachmentsMap,
                                    "group_name": comments.group_name,
                                    "group_members" : dotGroupMembersMap,
                                    "creative" : str(comments.creative),
                                    "fun": str(comments.fun),
                                    "truth": str(comments.truth),
                                    "user_id": comments.user_id,
                                    "topic_resp_rating_id": comments.topic_resp_rating_id,
                                    "rating_reaction": comments.rating_reaction,
                                    "rating_value": comments.rating_value
                                   })
    return jsonify(dotGroupCommentsMaps)


@bp.route('/solo_responses/<topic_id>',  methods=['GET'])
@require_oauth()
def solo_responses(topic_id):
    Responsess = soloResponses(topic_id)
    dotCommentsMaps = []
    for comments in Responsess:
        attachments = []
        if comments.attachments is not None:
            attachments = json.loads(comments.attachments)
        dotCommentsMaps.append({
                                    "response_description":comments.response_description,
                                    "created_by":comments.created_by,
                                    "created_date":comments.created_date,
                                    "display_name": comments.display_name,
                                    "avatar_image_file": comments.avatar_image_file,
                                    "class_details": comments.class_details,
                                    "school_name": comments.school_name,
                                    "topic_response_id": str(comments.topic_response_id),
                                    "is_final_submit": str(comments.is_final_submit),
                                    "attachments": attachments,
                                    "creative" : str(comments.creative),
                                    "fun": str(comments.fun),
                                    "truth": str(comments.truth),
                                    "user_id": comments.user_id,
                                    "topic_resp_rating_id": comments.topic_resp_rating_id,
                                    "rating_reaction": comments.rating_reaction,
                                    "rating_value": comments.rating_value
                                   })
    return jsonify(dotCommentsMaps)



