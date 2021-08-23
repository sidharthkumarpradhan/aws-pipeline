import os
from datetime import datetime

from flask import Blueprint, request, send_file, current_app
from flask import jsonify
from sqlalchemy import func, and_

from website.exceptions_dir.base_exceptions import BadRequest

from website.service_dir.dot_user_details_service import createDotUserDetails, updateDotUserDetails, forgotPassword
from website.service_dir.dot_user_details_service import findAll, findById, findBy, buddySearchByGroup, resetPassword
from website.service_dir.dot_user_details_service import importDotUserDetailss, deleteById, buddySearch, createUser
from website.service_dir.dot_user_details_service import createlogin, generateJoincodes, sendJoinCodesEmail, generateBulkJoincodes
from website.service_dir.dot_user_details_service import myBuddies
from website.oauth2 import require_oauth
from website.model_dir.dot_user_details import DotUserDetails
from website.model_dir.dot_login_history import DotLoginHistory
from json import loads
import pandas as pd

from authlib.integrations.flask_oauth2 import current_token

from website.utils_dir.common_utils import decrypt_message, encrypt_message, ran_gen

bp = Blueprint(__name__, 'dotUserDetails')


@bp.route('', methods=['POST', 'PUT', 'GET'])
@require_oauth()
def dotUserDetailsOps():
    dotUserDetailsObj = DotUserDetails()
    if request.method == 'POST':
        dotUserDetails = request.get_json(force=True)
        dotUserDetailsObj = createDotUserDetails(dotUserDetails)

    elif request.method == 'PUT':
        dotUserDetails = request.get_json(force=True)
        dotUserDetailsObj = updateDotUserDetails(dotUserDetails)

    elif request.method == 'GET':
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        sort = request.args.get('sort', 'lastmodified_date,desc', type=str)
        dotUserDetailsPages = findAll(page, per_page, sort)
        dotUserDetailss = dotUserDetailsPages.items
        dotUserDetailsMaps = []
        for dotUserDetails in dotUserDetailss:
            #dotUserDetails.display_name = decrypt_message(dotUserDetails.display_name)
            dotUserDetails.user_phone_num = decrypt_message(dotUserDetails.user_phone_num)
            dotUserDetailsMaps.append(dotUserDetails.as_dict())

        return jsonify(dotUserDetailsMaps), 200, {'X-Total-Count': dotUserDetailsPages.total}
    return jsonify(dotUserDetailsObj.as_dict())


@bp.route('/<id>',  methods=['GET'])
@require_oauth()
def findbyId(id):
    dotUserDetails = findById(id)
    return jsonify(dotUserDetails.as_dict())


@bp.route('/filter',  methods=['POST'])
@require_oauth()
def findbyFilter():
    filterDict = request.get_json(force=True)
    dotUserDetailss = findBy(**filterDict)
    dotUserDetailsMaps = []
    for dotUserDetails in dotUserDetailss:
        #dotUserDetails.display_name = decrypt_message(dotUserDetails.display_name)
        dotUserDetails.user_phone_num = decrypt_message(dotUserDetails.user_phone_num)
        dotUserDetailsMaps.append(dotUserDetails.as_dict())
    return jsonify(dotUserDetailsMaps), 200, {'X-Total-Count': len(dotUserDetailss)}


@bp.route('/import',  methods=['POST'])
@require_oauth()
def importDotUserDetailssRoute():
    csv_file = pd.DataFrame(pd.read_csv(request.files.get('file'),skiprows=1, sep=",", names=["email", "language", "location", "mobile", "name"], index_col=False))
    result = csv_file.to_json(orient="records")
    parsed = loads(result)
    importDotUserDetailss(parsed)
    return jsonify({"success": True})


@bp.route('/<id>',  methods=['DELETE'])
@require_oauth()
def deletebyId(id):
    deleteById(id)
    return jsonify({"success": True})


@bp.route('/info')
@require_oauth()
def info():
    user = current_token.user
    loginData = DotLoginHistory.query.filter(and_(datetime.now().strftime('%Y-%m-%d') == func.DATE(DotLoginHistory.login_date_time), DotLoginHistory.user_id==user.id)).count()
    if loginData >= 1:
        day_first_login = 0
    else:
        day_first_login = 1
    dotLoginHistory = DotLoginHistory()
    dotLoginHistory.user_id = user.id
    dotLoginHistory.login_id = user.username
    dotLoginHistory.login_date_time = datetime.now().strftime('%Y-%m-%dT%H:%M:%S')
    dotLoginHistory.save()
    dotUserDetails = findById(user.id)
    user_type = dotUserDetails.user_type
    login_hist_id = dotLoginHistory.login_hist_id

    return jsonify(id=user.id, username=user.username, usertype=user_type, display_name=dotUserDetails.display_name,
                   day_first_login=day_first_login, login_hist_id=login_hist_id)


@bp.route('/buddy_search',  methods=['POST'])
@require_oauth()
def buddy_search():
    filterDict = request.get_json(force=True)
    dotUserDetailss = buddySearch(filterDict)
    dotUserDetailsMaps = []
    for dotUserDetails in dotUserDetailss:
        #dotUserDetails.user_phone_num = decrypt_message(dotUserDetails.user_phone_num)
        dotUserDetailsMaps.append({"avatar_image_file": dotUserDetails.avatar_image_file,
                                   "class_details": dotUserDetails.class_details,
                                   'display_name': dotUserDetails.display_name,
                                   "first_name": dotUserDetails.first_name,
                                   "gender": dotUserDetails.gender,
                                   "school_name": dotUserDetails.school_name,
                                   "user_dob": dotUserDetails.user_dob,
                                   "user_email": dotUserDetails.user_email,
                                   "user_gmail": dotUserDetails.user_gmail,
                                   "user_id": dotUserDetails.user_id,
                                   "user_type":  dotUserDetails.user_type,
                                   "topic_assign_id":  dotUserDetails.topic_assign_id,
                                   "group_role_id": dotUserDetails.group_role_id})
    return jsonify(dotUserDetailsMaps)


@bp.route('/buddy_search_by_group',  methods=['POST'])
@require_oauth()
def buddy_search_by_group():
    dotUserDetailss = buddySearchByGroup()
    dotUserDetailsMaps = []
    for dotUserDetails in dotUserDetailss:
        user_phone_num = decrypt_message(dotUserDetails.user_phone_num)
        dotUserDetailsMaps.append({"user_id":dotUserDetails.user_id,
                                   "user_phone_num":user_phone_num,
                                   "user_type":dotUserDetails.user_type,
                                   "display_name": dotUserDetails.display_name,
                                   "user_email": dotUserDetails.user_email,
                                   "user_gmail": dotUserDetails.user_gmail,
                                   "avatar_image_file": dotUserDetails.avatar_image_file,
                                   "school_name": dotUserDetails.school_name,
                                   "class_details": dotUserDetails.class_details,
                                   "user_dob": dotUserDetails.user_dob
                                   })
    return jsonify(dotUserDetailsMaps)


@bp.route('/forgot_password',  methods=['POST'])
def forgot_password():
    EmailJSON = request.get_json(force=True)
    dotUserDetailsMaps = forgotPassword(EmailJSON)
    return jsonify(dotUserDetailsMaps)


@bp.route('/reset_password', methods=['POST'])
@require_oauth()
def reset_password():
    form_data = request.get_json(force=True)
    return_obj = resetPassword(form_data)
    return jsonify(return_obj)


@bp.route('/generate_joincodes', methods=['POST'])
@require_oauth()
def generate_joincodes():
    requestData = request.get_json(force=True)
    joincodeMap = generateBulkJoincodes(requestData['count'])
    sendJoinCodesEmail(joincodeMap)
    return jsonify(joincodeMap)


@bp.route('/create_login',  methods=['POST'])
@require_oauth()
def create_login():
    dotUserDetailsJSON = request.get_json(force=True)
    dotUserDetails = createlogin(dotUserDetailsJSON)
    return jsonify(dotUserDetails.as_dict())



@bp.route('/my_buddies', methods=['GET'])
@require_oauth()
def my_buddies():
    dotUserDetails = myBuddies()
    dotUserDetailsMap = []
    for dotUser in dotUserDetails:
        user_phone_num = None
        if dotUser.user_phone_num is not None:
            user_phone_num = decrypt_message(dotUser.user_phone_num)
        dotUserDetailsMap.append({"user_id": dotUser.user_id,
                                  "display_name": dotUser.display_name,
                                  "user_type": dotUser.user_type,
                                  "gender": dotUser.gender,
                                  "user_email": dotUser.user_email,
                                  "school_name": dotUser.school_name,
                                  "class_details": dotUser.class_details,
                                  "avatar_image_file": dotUser.avatar_image_file,
                                  "user_dob": dotUser.user_dob,
                                  "user_phone_num": user_phone_num})
    return jsonify(dotUserDetailsMap)

