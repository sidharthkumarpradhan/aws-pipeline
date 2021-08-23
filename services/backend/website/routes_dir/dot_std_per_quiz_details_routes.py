from authlib.integrations.flask_oauth2 import current_token
from flask import Blueprint, request
from flask import jsonify
from website.service_dir.dot_std_per_quiz_details_service import createDotStdPerQuizDetails, updateDotStdPerQuizDetails
from website.service_dir.dot_std_per_quiz_details_service import findAll, findById, findBy, bulk_addDotStdPerQuizDetailss
from website.service_dir.dot_std_per_quiz_details_service import importDotStdPerQuizDetailss, deleteById, studentQuizDetails
from website.service_dir.dot_std_per_quiz_details_service import responseQuizDetails
from website.oauth2 import require_oauth
from website.model_dir.dot_std_per_quiz_details import DotStdPerQuizDetails
from json import loads
import pandas as pd
from sqlalchemy import and_


bp = Blueprint(__name__, 'dotStdPerQuizDetails')


@bp.route('', methods=['POST', 'PUT', 'GET'])
@require_oauth()
def dotStdPerQuizDetailsOps():
    dotStdPerQuizDetailsObj = DotStdPerQuizDetails()
    if request.method == 'POST':
        dotStdPerQuizDetails = request.get_json(force=True)
        dotStdPerQuizDetailsObj = createDotStdPerQuizDetails(dotStdPerQuizDetails)
        return jsonify({"success": True})

    elif request.method == 'PUT':
        dotStdPerQuizDetails = request.get_json(force=True)
        dotStdPerQuizDetailsObj = updateDotStdPerQuizDetails(dotStdPerQuizDetails)

    elif request.method == 'GET':
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        sort = request.args.get('sort', 'lastmodified_date,desc', type=str)
        dotStdPerQuizDetailsPages = findAll(page, per_page, sort)
        dotStdPerQuizDetailss = dotStdPerQuizDetailsPages.items
        dotStdPerQuizDetailsMaps = []
        for dotStdPerQuizDetails in dotStdPerQuizDetailss:
            dotStdPerQuizDetailsMaps.append(dotStdPerQuizDetails.as_dict())

        return jsonify(dotStdPerQuizDetailsMaps), 200, {'X-Total-Count': dotStdPerQuizDetailsPages.total}
    return jsonify(dotStdPerQuizDetailsObj.as_dict())


@bp.route('/<id>',  methods=['GET'])
@require_oauth()
def findbyId(id):
    dotStdPerQuizDetails = findById(id)
    return jsonify(dotStdPerQuizDetails.as_dict())


@bp.route('/filter',  methods=['POST'])
@require_oauth()
def findbyFilter():
    filterDict = request.get_json(force=True)
    dotStdPerQuizDetailss = findBy(**filterDict)
    dotStdPerQuizDetailsMaps = []
    for dotStdPerQuizDetails in dotStdPerQuizDetailss:
        dotStdPerQuizDetailsMaps.append(dotStdPerQuizDetails.as_dict())
    return jsonify(dotStdPerQuizDetailsMaps), 200, {'X-Total-Count': len(dotStdPerQuizDetailss)}


@bp.route('/import',  methods=['POST'])
@require_oauth()
def importDotStdPerQuizDetailssRoute():
    csv_file = pd.DataFrame(pd.read_csv(request.files.get('file'),skiprows=1, sep=",", names=["email", "language", "location", "mobile", "name"], index_col=False))
    result = csv_file.to_json(orient="records")
    parsed = loads(result)
    importDotStdPerQuizDetailss(parsed)
    return jsonify({"success": True})


@bp.route('/<id>',  methods=['DELETE'])
@require_oauth()
def deletebyId(id):
    deleteById(id)
    return jsonify({"success": True})


@bp.route('/bulk_add',  methods=['POST'])
@require_oauth()
def bulk_addDotStdPerQuizDetailssRoute():
    quizDetailss = request.get_json(force=True)
    if quizDetailss is not None:
        dotStdPerQuizDetailss = findBy(user_id=current_token.user.id,)
        if dotStdPerQuizDetailss is not None:
            for stdPerQuizDetails in dotStdPerQuizDetailss:
                stdPerQuizDetails.delete()
        bulk_addDotStdPerQuizDetailss(quizDetailss)
    return jsonify({"success": True})



@bp.route('/student_quiz_details',  methods=['GET'])
@require_oauth()
def user_quiz_details():
    dotStdPerQuizDetailsOps = studentQuizDetails()
    dotStdPerQuizDetailsMaps = []
    for dotStdPerQuizDetails in dotStdPerQuizDetailsOps:
        responseQuizDetailss = responseQuizDetails(dotStdPerQuizDetails.quiz_id)
        responseMaps = []
        if responseQuizDetailss is not None:
            for responseQuiz in responseQuizDetailss:
                responseMaps.append({"response":responseQuiz.quiz_response})
        optionsMaps = []
        if dotStdPerQuizDetails.option1 is not None:
            optionsMaps.append({'option': dotStdPerQuizDetails.option1})
        if dotStdPerQuizDetails.option2 is not None:
            optionsMaps.append({'option': dotStdPerQuizDetails.option2})
        if dotStdPerQuizDetails.option3 is not None:
            optionsMaps.append({'option': dotStdPerQuizDetails.option3})
        if dotStdPerQuizDetails.option4 is not None:
            optionsMaps.append({'option': dotStdPerQuizDetails.option4})
        if dotStdPerQuizDetails.option5 is not None:
            optionsMaps.append({'option': dotStdPerQuizDetails.option5})
        if dotStdPerQuizDetails.option6 is not None:
            optionsMaps.append({'option': dotStdPerQuizDetails.option6})
        if dotStdPerQuizDetails.option7 is not None:
            optionsMaps.append({'option': dotStdPerQuizDetails.option7})
        if dotStdPerQuizDetails.option8 is not None:
            optionsMaps.append({'option': dotStdPerQuizDetails.option8})
        if dotStdPerQuizDetails.option9 is not None:
            optionsMaps.append({'option': dotStdPerQuizDetails.option9})
        if dotStdPerQuizDetails.option10 is not None:
            optionsMaps.append({'option': dotStdPerQuizDetails.option10})
        dotStdPerQuizDetailsMaps.append({'quiz_id':dotStdPerQuizDetails.quiz_id,
                                         'quiz_description':dotStdPerQuizDetails.quiz_description,
                                         'quiz_file_path': dotStdPerQuizDetails.quiz_file_path,
                                         'quiz_order': dotStdPerQuizDetails.quiz_order,
                                         'quiz_status': dotStdPerQuizDetails.quiz_status,
                                         'type': dotStdPerQuizDetails.type,
                                         'options': optionsMaps,
                                         'topic_id': dotStdPerQuizDetails.topic_id,
                                         'is_active': dotStdPerQuizDetails.is_active,
                                         'created_by': dotStdPerQuizDetails.created_by,
                                         'created_date': dotStdPerQuizDetails.created_date,
                                         'lastmodified_by': dotStdPerQuizDetails.lastmodified_by,
                                         'lastmodified_date': dotStdPerQuizDetails.lastmodified_date,
                                         'quiz_icon_file_path':dotStdPerQuizDetails.quiz_icon_file_path,
                                         #'stud_quiz_id':dotStdPerQuizDetails.stud_quiz_id,
                                         #'quiz_start_date': dotStdPerQuizDetails.quiz_start_date,
                                         #'quiz_completion_date': dotStdPerQuizDetails.quiz_completion_date,
                                         'quiz_response': responseMaps,
                                         #'quiz_response_notes': dotStdPerQuizDetails.quiz_response_notes,
                                         #'user_id': dotStdPerQuizDetails.user_id,
                                         })
    return jsonify(dotStdPerQuizDetailsMaps)
