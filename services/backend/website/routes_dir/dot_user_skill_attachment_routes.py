from flask import Blueprint, request
from flask import jsonify
from website.service_dir.dot_user_skill_attachment_service import createDotUserSkillAttachment, updateDotUserSkillAttachment
from website.service_dir.dot_user_skill_attachment_service import findAll, findById, findBy
from website.service_dir.dot_user_skill_attachment_service import importDotUserSkillAttachments, deleteById
from website.oauth2 import require_oauth
from website.model_dir.dot_user_skill_attachment import DotUserSkillAttachment
from json import loads
import pandas as pd

bp = Blueprint(__name__, 'dotUserSkillAttachment')


@bp.route('', methods=['POST', 'PUT', 'GET'])
@require_oauth()
def dotUserSkillAttachmentOps():
    dotUserSkillAttachmentObj = DotUserSkillAttachment()
    if request.method == 'POST':
        dotUserSkillAttachment = request.get_json(force=True)
        dotUserSkillAttachmentObj = createDotUserSkillAttachment(dotUserSkillAttachment)

    elif request.method == 'PUT':
        dotUserSkillAttachment = request.get_json(force=True)
        dotUserSkillAttachmentObj = updateDotUserSkillAttachment(dotUserSkillAttachment)

    elif request.method == 'GET':
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        sort = request.args.get('sort', 'lastmodified_date,desc', type=str)
        dotUserSkillAttachmentPages = findAll(page, per_page, sort)
        dotUserSkillAttachments = dotUserSkillAttachmentPages.items
        dotUserSkillAttachmentMaps = []
        for dotUserSkillAttachment in dotUserSkillAttachments:
            dotUserSkillAttachmentMaps.append(dotUserSkillAttachment.as_dict())

        return jsonify(dotUserSkillAttachmentMaps), 200, {'X-Total-Count': dotUserSkillAttachmentPages.total}
    return jsonify(dotUserSkillAttachmentObj.as_dict())


@bp.route('/<id>',  methods=['GET'])
@require_oauth()
def findbyId(id):
    dotUserSkillAttachment = findById(id)
    return jsonify(dotUserSkillAttachment.as_dict())


@bp.route('/filter',  methods=['POST'])
@require_oauth()
def findbyFilter():
    filterDict = request.get_json(force=True)
    dotUserSkillAttachments = findBy(**filterDict)
    dotUserSkillAttachmentMaps = []
    for dotUserSkillAttachment in dotUserSkillAttachments:
        dotUserSkillAttachmentMaps.append(dotUserSkillAttachment.as_dict())
    return jsonify(dotUserSkillAttachmentMaps), 200, {'X-Total-Count': len(dotUserSkillAttachments)}


@bp.route('/import',  methods=['POST'])
@require_oauth()
def importDotUserSkillAttachmentsRoute():
    csv_file = pd.DataFrame(pd.read_csv(request.files.get('file'),skiprows=1, sep=",", names=["email", "language", "location", "mobile", "name"], index_col=False))
    result = csv_file.to_json(orient="records")
    parsed = loads(result)
    importDotUserSkillAttachments(parsed)
    return jsonify({"success": True})


@bp.route('/<id>',  methods=['DELETE'])
@require_oauth()
def deletebyId(id):
    deleteById(id)
    return jsonify({"success": True})
