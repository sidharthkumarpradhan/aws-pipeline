import json
import os

from sqlalchemy import null

from website.exceptions_dir.base_exceptions import BadRequest
from flask import Blueprint, request, current_app
from flask import jsonify
from website.service_dir.dot_topic_details_service import createDotTopicDetails, updateDotTopicDetails, challengeTop10
from website.service_dir.dot_topic_details_service import findAll, findById, findBy, recentChallenges, autoAssign
from website.service_dir.dot_topic_details_service import importDotTopicDetailss, deleteById, createChallengeDetails
from website.service_dir.dot_topic_details_service import updateChallengeDetails, topicAssignmentsDetails,QuestMap
from website.service_dir.dot_topic_details_service import ChallengeFeedback, challengeTrend, watchAgain, challengeAssigned
from website.service_dir.dot_topic_details_service import dotChallenges, dotQuests, dotDailyDots, shareChallenge, findAllBy
from website.service_dir.dot_topic_details_service import spotlightChallenges, topicAttachments, topicDetailsById, responseCards
from website.service_dir.dot_topic_details_service import getTopicRoles, soloChallenges, joinSoloChallenge, topicAssignmentByUser
from website.service_dir.dot_topic_details_service import continueChallenges, myChallenges, top10Responses, influencerChallenges
from website.service_dir.dot_topic_details_service import getChallengeTags, searchChallenges, challengeInvititations, upcomingChallenges
from website.oauth2 import require_oauth
from website.model_dir.dot_topic_details import DotTopicDetails
from json import loads
import pandas as pd

from authlib.integrations.flask_oauth2 import current_token

bp = Blueprint(__name__, 'dotTopicDetails')


@bp.route('', methods=['POST', 'PUT', 'GET'])
@require_oauth()
def dotTopicDetailsOps():
    dotTopicDetailsObj = DotTopicDetails()
    if request.method == 'POST':
        dotTopicDetails = request.get_json(force=True)
        dotTopicDetailsObj = createDotTopicDetails(dotTopicDetails)

    elif request.method == 'PUT':
        dotTopicDetails = request.get_json(force=True)
        dotTopicDetailsObj = updateDotTopicDetails(dotTopicDetails)

    elif request.method == 'GET':
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        sort = request.args.get('sort', 'lastmodified_date,desc', type=str)
        dotTopicDetailsPages = findAll(page, per_page, sort)
        dotTopicDetailss = dotTopicDetailsPages.items
        dotTopicDetailsMaps = []
        for dotTopicDetails in dotTopicDetailss:
            dotTopicDetailsMaps.append(dotTopicDetails.as_dict())

        return jsonify(dotTopicDetailsMaps), 200, {'X-Total-Count': dotTopicDetailsPages.total}
    return jsonify(dotTopicDetailsObj.as_dict())

@bp.route('/topicAssignmentId/<id>',  methods=['GET'])
@require_oauth()
def topicAssignmentId(id):
    dotTopicassignment = topicAssignmentByUser(id)
    return jsonify(dotTopicassignment)

@bp.route('/<id>',  methods=['GET'])
@require_oauth()
def findbyId(id):
    dotTopicDetailss = topicDetailsById(id)
    dotTopicDetailsObj = {}
    attachments = topicAttachments(id)
    attachmentsMap = []
    for attachment in attachments:
        attachmentsMap.append({"attachment_title": attachment.attachment_title, "attachment_file_path": attachment.attachment_file_path})
    dotTopicassignment = topicAssignmentByUser(id)
    topic_assign_id = ""

    if dotTopicassignment is not None:
        topic_assign_id = dotTopicassignment.topic_assign_id

    for dotTopicDetails in dotTopicDetailss:
        if topic_assign_id == "":
            topic_assign_id = dotTopicDetails.topic_assign_id
        dotTopicDetailsObj = {"topic_id": dotTopicDetails.topic_id,
                                    "topic_type": dotTopicDetails.topic_type,
                                    "topic_name": dotTopicDetails.topic_name,
                                    "topic_description": dotTopicDetails.topic_description,
                                    "topic_duration": dotTopicDetails.topic_duration,
                                    "topic_earning_title": dotTopicDetails.topic_earning_title,
                                    "topic_earning_badge": dotTopicDetails.topic_earning_badge,
                                    "topic_dot_coins": dotTopicDetails.topic_dot_coins,
                                    "topic_status": dotTopicDetails.topic_status,
                                    "is_active": dotTopicDetails.is_active,
                                    "is_spotlight": dotTopicDetails.is_spotlight,
                                    "topic_start_date": dotTopicDetails.topic_start_date,
                                    "topic_end_date": dotTopicDetails.topic_end_date,
                                    "topic_group_size": dotTopicDetails.topic_group_size,
                                    "topic_assign_id": topic_assign_id,
                                    "assignment_status": dotTopicDetails.assignment_status,
                                    "date_of_assignment": dotTopicDetails.date_of_assignment,
                                    "assign_feedback_option": dotTopicDetails.assign_feedback_option,
                                    "assign_feedback_notes": dotTopicDetails.assign_feedback_notes,
                                    "group_role_id": dotTopicDetails.group_role_id,
                                    "group_id": dotTopicDetails.group_id,
                                    "final_submitted": dotTopicDetails.final_submitted,
                                    "user_id": dotTopicDetails.user_id,
                                    "display_name": dotTopicDetails.display_name,
                                    "avatar_image_file": dotTopicDetails.avatar_image_file,
                                    "school_name": dotTopicDetails.school_name,
                                    "class_details": dotTopicDetails.class_details,
                                    "role_id": dotTopicDetails.role_id,
                                    "role_name": dotTopicDetails.role_name,
                                    "role_avatar": dotTopicDetails.role_avatar,
                                    "role_assigned_to": dotTopicDetails.role_assigned_to}
    dotTopicDetailsObj["attachments"] = attachmentsMap
    return jsonify(dotTopicDetailsObj)


@bp.route('/edit/<id>',  methods=['GET'])
@require_oauth()
def edit(id):
    dotTopicDetailss = findById(id)
    dotTopicDetailsObj = dotTopicDetailss.as_dict()
    attachments = topicAttachments(id)
    attachmentsMap = []
    for attachment in attachments:
        attachmentsMap.append({"attachment_title": attachment.attachment_title, "file": attachment.attachment_file_path})
    dotTopicDetailsObj["attachments"] = attachmentsMap
    dotTopicRoless = getTopicRoles(id)
    dotTopicRolesMap = []
    for dotTopicRoles in dotTopicRoless:
        dotTopicRolesMap.append(dotTopicRoles.as_dict())
    dotTopicDetailsObj["roles"] = dotTopicRolesMap
    tags = getChallengeTags(id)
    dotTopicDetailsObj["tags"] = tags
    return jsonify(dotTopicDetailsObj)


@bp.route('/filter',  methods=['POST'])
@require_oauth()
def findbyFilter():
    filterDict = request.get_json(force=True)
    dotTopicDetailss = findBy(**filterDict)
    dotTopicDetailsMaps = []
    for dotTopicDetails in dotTopicDetailss:
        dotTopicDetailsMaps.append(dotTopicDetails.as_dict())
    return jsonify(dotTopicDetailsMaps), 200, {'X-Total-Count': len(dotTopicDetailss)}


@bp.route('/filter_all',  methods=['POST'])
@require_oauth()
def filter_all():
    filterDict = request.get_json(force=True)
    dotTopicDetailss = findAllBy(**filterDict)
    dotTopicDetailsMaps = []
    for dotTopicDetails in dotTopicDetailss:
        dotTopicDetailsMaps.append(dotTopicDetails.as_dict())
    return jsonify(dotTopicDetailsMaps), 200, {'X-Total-Count': len(dotTopicDetailss)}


@bp.route('/import',  methods=['POST'])
@require_oauth()
def importDotTopicDetailssRoute():
    csv_file = pd.DataFrame(pd.read_csv(request.files.get('file'),skiprows=1, sep=",", names=["email", "language", "location", "mobile", "name"], index_col=False))
    result = csv_file.to_json(orient="records")
    parsed = loads(result)
    importDotTopicDetailss(parsed)
    return jsonify({"success": True})


@bp.route('/<id>',  methods=['DELETE'])
@require_oauth()
def deletebyId(id):
    deleteById(id)
    return jsonify({"success": True})


@bp.route('/create_challenge',  methods=['POST'])
@require_oauth()
def createChallenge():
    dotTopicDetails = request.get_json(force=True)
    dotTopicDetailss = createChallengeDetails(dotTopicDetails)
    dotTopicDetailsObj = dotTopicDetailss.as_dict()
    topic_id = dotTopicDetailsObj["topic_id"]
    dotTopicRoless = getTopicRoles(topic_id)
    dotTopicRolesMap = []
    for dotTopicRoles in dotTopicRoless:
        dotTopicRolesMap.append(dotTopicRoles.as_dict())
    dotTopicDetailsObj["roles"] = dotTopicRolesMap
    return jsonify(dotTopicDetailsObj)


@bp.route("/update_challenge", methods=['PUT'])
@require_oauth()
def updateChallenge():
    dotTopicDetails = request.get_json(force=True)
    dotTopicDetailsObj = updateChallengeDetails(dotTopicDetails)
    return jsonify(dotTopicDetailsObj.as_dict())


@bp.route("/topic_assignments/<id>", methods=['GET'])
@require_oauth()
def topicAssignments(id):
    assignments = topicAssignmentsDetails(id)
    return jsonify(assignments)


@bp.route("/share_challenge", methods=['POST'])
@require_oauth()
def share_challenge():
    dotTopicAssignments = request.get_json(force=True)
    shareChallenge(dotTopicAssignments)
    return jsonify({"success": True})


@bp.route("/quest_map/<id>", methods=['GET'])
@require_oauth()
def quest_map(id):
    questmap = QuestMap(id)
    dotQuestMaps = []
    for quest in questmap:
        dotQuestMaps.append(quest.to_dict())
    return jsonify(dotQuestMaps), 200, {'X-Total-Count': len(questmap)}


@bp.route('/recent_challenges',  methods=['POST'])
@require_oauth()
def recent_challenges():
    dotChallengeJSON = request.get_json(force=True)
    dotTopicDetailsMaps = recentChallenges(dotChallengeJSON)
    return jsonify(dotTopicDetailsMaps)


@bp.route('/upcoming_challenges',  methods=['POST'])
@require_oauth()
def upcoming_challenges():
    dotChallengeJSON = request.get_json(force=True)
    dotTopicDetailsMaps = upcomingChallenges(dotChallengeJSON)
    return jsonify(dotTopicDetailsMaps)


@bp.route('/spotlight_challenges',  methods=['GET'])
@require_oauth()
def spotlight_challenges():
    dotTopicDetailsMaps = spotlightChallenges()
    return jsonify(dotTopicDetailsMaps)


@bp.route('/challenge_top10',  methods=['POST'])
@require_oauth()
def challenge_top10():
    dottop10ChallengeJSON = request.get_json(force=True)
    dotTopicDetailsMaps = challengeTop10(dottop10ChallengeJSON)
    return jsonify(dotTopicDetailsMaps)


@bp.route('/challenge_trend',  methods=['POST'])
@require_oauth()
def challenge_trend():
    dotTrendChallengeJSON = request.get_json(force=True)
    dotTopicDetailsMaps = challengeTrend(dotTrendChallengeJSON)
    return jsonify(dotTopicDetailsMaps)


@bp.route('/watch_again',  methods=['GET'])
@require_oauth()
def watch_again():
    dotTopicAssignmentss = watchAgain()
    dotTopicAssignmentsMaps = []
    for dotTopicAssignments in dotTopicAssignmentss:
        dotTopicDetails = findById(dotTopicAssignments.topic_id)
        topicFeedback = ChallengeFeedback(dotTopicAssignments.topic_id)
        topicAssignmentStatus = topicAssignments.assignment_status
        feedbackList = {"Creative": 0, "Fun": 0, "Novel": 0, "GoodForMe": 0, "Truth": 0}
        for feedback in topicFeedback:
            if feedback[1] is not None:
                feedbackList[feedback[1]] = feedback[2]
        dotTopicAssignmentsMaps.append({"topic_id": dotTopicAssignments.topic_id, "topic_name":dotTopicDetails.topic_name, "assignment_status":topicAssignmentStatus, "topic_created_by":dotTopicDetails.created_by, "topic_created_date":dotTopicDetails.created_date, "topic_assign_id": dotTopicAssignments.topic_assign_id, "feedback": feedbackList})
    return jsonify(dotTopicAssignmentsMaps), 200, {'X-Total-Count': len(dotTopicAssignmentss)}


@bp.route('/auto_assign',  methods=['POST'])
@require_oauth()
def auto_assign():
    dotTopicJson = request.get_json(force=True)
    dotTopicAssignmentss = autoAssign(dotTopicJson['topic_id'])
    return jsonify(dotTopicAssignmentss.as_dict())


@bp.route('/dot_activities',  methods=['GET'])
@require_oauth()
def dot_activities():
    dotChallengess = dotChallenges()
    dotQuestss = dotQuests()
    dotDailyDotss = dotDailyDots()
    return jsonify({"Challenge": dotChallengess,"Quest": dotQuestss, "daily_dots":dotDailyDotss})


@bp.route('/solo_challenges', methods = ['POST'])
@require_oauth()
def solo_challenges():
    dotSoloChallengeJSON = request.get_json(force=True)
    dotTopicDetailsMaps = soloChallenges(dotSoloChallengeJSON)
    return jsonify(dotTopicDetailsMaps)


@bp.route('/join_solo_challenge', methods = ['POST'])
@require_oauth()
def join_solo_challenge():
    dotSoloChallengeJSON = request.get_json(force=True)
    dotTopicAssignment = joinSoloChallenge(dotSoloChallengeJSON)
    return jsonify(dotTopicAssignment.as_dict())


@bp.route('/continue_challenges', methods = ['POST'])
@require_oauth()
def continue_challenges():
    dotcontinueChallengeJSON = request.get_json(force=True)
    dotTopicDetailsMaps = continueChallenges(dotcontinueChallengeJSON)
    return jsonify(dotTopicDetailsMaps)


@bp.route('/my_challenges', methods = ['POST'])
@require_oauth()
def my_challenges():
    dotMyChallengeJSON = request.get_json(force=True)
    dotTopicDetailsMaps = myChallenges(dotMyChallengeJSON)
    return jsonify(dotTopicDetailsMaps)


@bp.route('/top10_responses', methods = ['GET'])
@require_oauth()
def top10_responses():
    dotTopicResponseMaps = top10Responses()
    return jsonify(dotTopicResponseMaps)


@bp.route('/influencer_challenges', methods= ['GET'])
@require_oauth()
def influencer_challenges():
    dotTopicDetailsMaps = influencerChallenges()
    return jsonify(dotTopicDetailsMaps)


@bp.route('/response_cards/<topic_id>', methods=['GET'])
@require_oauth()
def response_cards(topic_id):
    dotTopicDetailsMaps = responseCards(topic_id)
    return jsonify(dotTopicDetailsMaps)


@bp.route('/search', methods = ['POST'])
@require_oauth()
def search():
    dotTopicSearchJSON = request.get_json(force=True)
    dotTopicDetailsMaps = searchChallenges(dotTopicSearchJSON)
    return jsonify(dotTopicDetailsMaps)


@bp.route('/challenge_invitations/<topic_id>', methods = ['GET'])
@require_oauth()
def challenge_invitations(topic_id):
    dotTopicInvitations = challengeInvititations(topic_id)
    dotTopicInvitationsMap = []
    for dotTopicInvitation in dotTopicInvitations:
        invited_by = json.loads(dotTopicInvitation.invited_by)
        group_members = json.loads(dotTopicInvitation.group_members)
        dotTopicInvitationsMap.append({"group_id": dotTopicInvitation.group_id,
                                       "group_name": dotTopicInvitation.group_name,
                                       "topic_assign_id": dotTopicInvitation.topic_assign_id,
                                       "invited_by": invited_by,
                                       "group_members": group_members})
    return jsonify(dotTopicInvitationsMap)


