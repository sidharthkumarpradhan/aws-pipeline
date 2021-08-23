import os
import json
from sqlalchemy import or_, and_, extract, func, text

from flask import Blueprint, request
from flask import jsonify, redirect, url_for
from sqlalchemy.orm import session

from website.service_dir.dot_user_skills_service import createDotUserSkills, updateDotUserSkills
from website.service_dir.dot_user_skills_service import findAll, findById, findBy, userSkillsByCategory
from website.service_dir.dot_user_skills_service import importDotUserSkillss, deleteById, bulk_addDotUserSkillss
from website.oauth2 import require_oauth
from website.model_dir.dot_user_skills import DotUserSkills
from website.model_dir.dot_skill_details import DotSkillDetails
from website.model_dir.dot_user_skill_attachment import DotUserSkillAttachment
from json import loads
import pandas as pd
from werkzeug.utils import secure_filename

bp = Blueprint(__name__, 'dotUserSkills')


@bp.route('', methods=['POST', 'PUT', 'GET'])
@require_oauth()
def dotUserSkillsOps():
    dotUserSkillsObj = DotUserSkills()
    if request.method == 'POST':
        dotUserSkills = request.get_json(force=True)
        dotUserSkillsObj = createDotUserSkills(dotUserSkills)

    elif request.method == 'PUT':
        dotUserSkills = request.get_json(force=True)
        dotUserSkillsObj = updateDotUserSkills(dotUserSkills)

    elif request.method == 'GET':
        dotUserSkillss = findAll()
        dotUserSkillsMaps = []
        for dotUserSkills in dotUserSkillss:
            attachments = None
            if dotUserSkills.attachments is not None:
                attachments = json.loads(dotUserSkills.attachments)
            dotUserSkillsMaps.append({
                "attachments": attachments,
                "skill_category": dotUserSkills.skill_category,
                "skill_id": dotUserSkills.skill_id,
                "skill_name": dotUserSkills.skill_name,
                #"others_option": dotUserSkills.others_option,
                "is_selected": dotUserSkills.is_selected})
        return jsonify(dotUserSkillsMaps)
    return jsonify(dotUserSkillsObj.as_dict())


@bp.route('/<category>', methods=['GET'])
@require_oauth()
def user_skills_by_category(category):
    dotUserSkillss = userSkillsByCategory(category)
    dotUserSkillsMaps = []
    for dotUserSkills in dotUserSkillss:
        attachments = None
        if dotUserSkills.attachments is not None:
            attachments = json.loads(dotUserSkills.attachments)
        dotUserSkillsMaps.append({
            "attachments": attachments,
            "skill_category": dotUserSkills.skill_category,
            "skill_id": dotUserSkills.skill_id,
            "skill_name": dotUserSkills.skill_name,
            #"others_option":dotUserSkills.others_option,
            "is_selected": dotUserSkills.is_selected})
    return jsonify(dotUserSkillsMaps)


@bp.route('/filter',  methods=['POST'])
@require_oauth()
def findbyFilter():
    filterDict = request.get_json(force=True)
    dotUserSkillss = findBy(**filterDict)
    dotUserSkillsMaps = []
    for dotUserSkills in dotUserSkillss:
        dotSkillFiless = DotUserSkillAttachment.query.filter(DotUserSkillAttachment.user_skill_id == dotUserSkills.user_skill_id).all()
        dotSkillFilesMap = []
        if dotSkillFiless is not None:
            for dotSkillFiles in dotSkillFiless:
                dotSkillFilesMap.append({"file":dotSkillFiles.user_skill_file,"display_name":dotSkillFiles.display_name})
        dotUserSkillsMaps.append({
            "skill_achievements": dotUserSkills.skill_achievements,
            "skill_file": dotSkillFilesMap,
            "skill_id": dotUserSkills.skill_id,
            "skill_name": dotUserSkills.skill.skill_name,
            "user_skill_id": dotUserSkills.user_skill_id})
    return jsonify(dotUserSkillsMaps), 200, {'X-Total-Count': len(dotUserSkillss)}


@bp.route('/import',  methods=['POST'])
@require_oauth()
def importDotUserSkillssRoute():
    csv_file = pd.DataFrame(pd.read_csv(request.files.get('file'),skiprows=1, sep=",", names=["email", "language", "location", "mobile", "name"], index_col=False))
    result = csv_file.to_json(orient="records")
    parsed = loads(result)
    importDotUserSkillss(parsed)
    return jsonify({"success": True})


@bp.route('/<id>',  methods=['DELETE'])
@require_oauth()
def deletebyId(id):
    deleteById(id)
    return jsonify({"success": True})


@bp.route('/bulk_add',  methods=['POST'])
@require_oauth()
def bulk_addDotUserSkillssRoute():
    user_skills = request.get_json(force=True)
    userskills = bulk_addDotUserSkillss(user_skills)
    return jsonify({"success": True})



@bp.route('/update',  methods=['POST'])
@require_oauth()
def bulk_updateUserSkillssRoute():
    user_skills = request.get_json(force=True)
    userSkillsMap = []
    if "skills" in user_skills:
        for skills in user_skills['skills']:
            dotUserSkillss = DotUserSkills.query.filter(and_(DotUserSkills.user_id == user_skills['user_id'], DotUserSkills.skill_id == skills['skill'])).first()
            if dotUserSkillss is None:
            	dotUserSkills = DotUserSkills()
            	dotUserSkills.user_id = skills['user']
            	dotUserSkills.skill_id = skills['skill']
            	dotUserSkills.is_primary = skills['is_primary']
                #if 'others_option' in skills:
                    #dotUserSkills.others_option = skills['others_option']
            	dotUserSkills.save()
            	userSkillId = dotUserSkills.user_skill_id
            else:
                userSkillId = dotUserSkillss.user_skill_id
            userSkillsMap.append(userSkillId)
            if "skill_files" in skills:
                DotUserSkillAttachment.query.filter(
                    DotUserSkillAttachment.user_skill_id == userSkillId).delete()
                for files in skills['skill_files']:
                    dotUserSkillAttachment = DotUserSkillAttachment()
                    dotUserSkillAttachment.user_skill_id = userSkillId
                    dotUserSkillAttachment.user_skill_file = files['file']
                    dotUserSkillAttachment.display_name = files['display_name']
                    dotUserSkillAttachment.file_type = files['file_type']
                    dotUserSkillAttachment.save()
    delDotUserSkillss = DotUserSkills.query.join(DotSkillDetails, and_(DotSkillDetails.skill_id==DotUserSkills.skill_id,DotSkillDetails.skill_category == user_skills['skill_category']) ).filter(and_(DotUserSkills.user_skill_id.notin_(userSkillsMap), DotUserSkills.user_id == user_skills['user_id'])).all()
    for delDotUserSkills in delDotUserSkillss:
        deleteById(delDotUserSkills.user_skill_id)
    return jsonify({"success": True})




@bp.route('/file_location/<filename>',  methods=['GET'])
@require_oauth()
def file_locationRoute(filename):
    return redirect(url_for('static', filename='D:/Projects/DOTX/Codegen/services/website/uploads/' + filename), code=301)

