from flask import Blueprint, request
from flask import jsonify
from website.service_dir.dot_resp_attachment_service import createDotRespAttachment, updateDotRespAttachment
from website.service_dir.dot_resp_attachment_service import findAll, findById, findBy
from website.service_dir.dot_resp_attachment_service import importDotRespAttachments, deleteById
from website.oauth2 import require_oauth
from website.model_dir.dot_resp_attachment import DotRespAttachment
from json import loads
import pandas as pd

bp = Blueprint(__name__, 'dotRespAttachment')


@bp.route('', methods=['POST', 'PUT', 'GET'])
@require_oauth()
def dotRespAttachmentOps():
    dotRespAttachmentObj = DotRespAttachment()
    if request.method == 'POST':
        dotRespAttachment = request.get_json(force=True)
        dotRespAttachmentObj = createDotRespAttachment(dotRespAttachment)

    elif request.method == 'PUT':
        dotRespAttachment = request.get_json(force=True)
        dotRespAttachmentObj = updateDotRespAttachment(dotRespAttachment)

    elif request.method == 'GET':
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        sort = request.args.get('sort', 'lastmodified_date,desc', type=str)
        dotRespAttachmentPages = findAll(page, per_page, sort)
        dotRespAttachments = dotRespAttachmentPages.items
        dotRespAttachmentMaps = []
        for dotRespAttachment in dotRespAttachments:
            dotRespAttachmentMaps.append(dotRespAttachment.as_dict())

        return jsonify(dotRespAttachmentMaps), 200, {'X-Total-Count': dotRespAttachmentPages.total}
    return jsonify(dotRespAttachmentObj.as_dict())


@bp.route('/<id>',  methods=['GET'])
@require_oauth()
def findbyId(id):
    dotRespAttachment = findById(id)
    return jsonify(dotRespAttachment.as_dict())


@bp.route('/filter',  methods=['POST'])
@require_oauth()
def findbyFilter():
    filterDict = request.get_json(force=True)
    dotRespAttachments = findBy(**filterDict)
    dotRespAttachmentMaps = []
    for dotRespAttachment in dotRespAttachments:
        dotRespAttachmentMaps.append(dotRespAttachment.as_dict())
    return jsonify(dotRespAttachmentMaps), 200, {'X-Total-Count': len(dotRespAttachments)}


@bp.route('/import',  methods=['POST'])
@require_oauth()
def importDotRespAttachmentsRoute():
    csv_file = pd.DataFrame(pd.read_csv(request.files.get('file'),skiprows=1, sep=",", names=["email", "language", "location", "mobile", "name"], index_col=False))
    result = csv_file.to_json(orient="records")
    parsed = loads(result)
    importDotRespAttachments(parsed)
    return jsonify({"success": True})


@bp.route('/<id>',  methods=['DELETE'])
@require_oauth()
def deletebyId(id):
    deleteById(id)
    return jsonify({"success": True})
