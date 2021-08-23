from flask import Blueprint, request
from flask import jsonify
from website.service_dir.dot_topic_resp_attachments_service import createDotTopicRespAttachments, updateDotTopicRespAttachments
from website.service_dir.dot_topic_resp_attachments_service import findAll, findById, findBy
from website.service_dir.dot_topic_resp_attachments_service import importDotTopicRespAttachmentss, deleteById
from website.oauth2 import require_oauth
from website.model_dir.dot_topic_resp_attachments import DotTopicRespAttachments
from json import loads
import pandas as pd

bp = Blueprint(__name__, 'dotTopicRespAttachments')


@bp.route('', methods=['POST', 'PUT', 'GET'])
@require_oauth()
def dotTopicRespAttachmentsOps():
    dotTopicRespAttachmentsObj = DotTopicRespAttachments()
    if request.method == 'POST':
        dotTopicRespAttachments = request.get_json(force=True)
        dotTopicRespAttachmentsObj = createDotTopicRespAttachments(dotTopicRespAttachments)

    elif request.method == 'PUT':
        dotTopicRespAttachments = request.get_json(force=True)
        dotTopicRespAttachmentsObj = updateDotTopicRespAttachments(dotTopicRespAttachments)

    elif request.method == 'GET':
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        sort = request.args.get('sort', 'lastmodified_date,desc', type=str)
        dotTopicRespAttachmentsPages = findAll(page, per_page, sort)
        dotTopicRespAttachmentss = dotTopicRespAttachmentsPages.items
        dotTopicRespAttachmentsMaps = []
        for dotTopicRespAttachments in dotTopicRespAttachmentss:
            dotTopicRespAttachmentsMaps.append(dotTopicRespAttachments.as_dict())

        return jsonify(dotTopicRespAttachmentsMaps), 200, {'X-Total-Count': dotTopicRespAttachmentsPages.total}
    return jsonify(dotTopicRespAttachmentsObj.as_dict())


@bp.route('/<id>',  methods=['GET'])
@require_oauth()
def findbyId(id):
    dotTopicRespAttachments = findById(id)
    return jsonify(dotTopicRespAttachments.as_dict())


@bp.route('/filter',  methods=['POST'])
@require_oauth()
def findbyFilter():
    filterDict = request.get_json(force=True)
    dotTopicRespAttachmentss = findBy(**filterDict)
    dotTopicRespAttachmentsMaps = []
    for dotTopicRespAttachments in dotTopicRespAttachmentss:
        dotTopicRespAttachmentsMaps.append(dotTopicRespAttachments.as_dict())
    return jsonify(dotTopicRespAttachmentsMaps), 200, {'X-Total-Count': len(dotTopicRespAttachmentss)}


@bp.route('/import',  methods=['POST'])
@require_oauth()
def importDotTopicRespAttachmentssRoute():
    csv_file = pd.DataFrame(pd.read_csv(request.files.get('file'),skiprows=1, sep=",", names=["email", "language", "location", "mobile", "name"], index_col=False))
    result = csv_file.to_json(orient="records")
    parsed = loads(result)
    importDotTopicRespAttachmentss(parsed)
    return jsonify({"success": True})


@bp.route('/<id>',  methods=['DELETE'])
@require_oauth()
def deletebyId(id):
    deleteById(id)
    return jsonify({"success": True})
