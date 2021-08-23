from flask import Blueprint, request
from flask import jsonify
from website.service_dir.dot_topic_attachments_service import createDotTopicAttachments, updateDotTopicAttachments
from website.service_dir.dot_topic_attachments_service import findAll, findById, findBy
from website.service_dir.dot_topic_attachments_service import importDotTopicAttachmentss, deleteById
from website.oauth2 import require_oauth
from website.model_dir.dot_topic_attachments import DotTopicAttachments
from json import loads
import pandas as pd

bp = Blueprint(__name__, 'dotTopicAttachments')


@bp.route('', methods=['POST', 'PUT', 'GET'])
@require_oauth()
def dotTopicAttachmentsOps():
    dotTopicAttachmentsObj = DotTopicAttachments()
    if request.method == 'POST':
        dotTopicAttachments = request.get_json(force=True)
        dotTopicAttachmentsObj = createDotTopicAttachments(dotTopicAttachments)

    elif request.method == 'PUT':
        dotTopicAttachments = request.get_json(force=True)
        dotTopicAttachmentsObj = updateDotTopicAttachments(dotTopicAttachments)

    elif request.method == 'GET':
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        sort = request.args.get('sort', 'lastmodified_date,desc', type=str)
        dotTopicAttachmentsPages = findAll(page, per_page, sort)
        dotTopicAttachmentss = dotTopicAttachmentsPages.items
        dotTopicAttachmentsMaps = []
        for dotTopicAttachments in dotTopicAttachmentss:
            dotTopicAttachmentsMaps.append(dotTopicAttachments.as_dict())

        return jsonify(dotTopicAttachmentsMaps), 200, {'X-Total-Count': dotTopicAttachmentsPages.total}
    return jsonify(dotTopicAttachmentsObj.as_dict())


@bp.route('/<id>',  methods=['GET'])
@require_oauth()
def findbyId(id):
    dotTopicAttachments = findById(id)
    return jsonify(dotTopicAttachments.as_dict())


@bp.route('/filter',  methods=['POST'])
@require_oauth()
def findbyFilter():
    filterDict = request.get_json(force=True)
    dotTopicAttachmentss = findBy(**filterDict)
    dotTopicAttachmentsMaps = []
    for dotTopicAttachments in dotTopicAttachmentss:
        dotTopicAttachmentsMaps.append(dotTopicAttachments.as_dict())
    return jsonify(dotTopicAttachmentsMaps), 200, {'X-Total-Count': len(dotTopicAttachmentss)}


@bp.route('/import',  methods=['POST'])
@require_oauth()
def importDotTopicAttachmentssRoute():
    csv_file = pd.DataFrame(pd.read_csv(request.files.get('file'),skiprows=1, sep=",", names=["email", "language", "location", "mobile", "name"], index_col=False))
    result = csv_file.to_json(orient="records")
    parsed = loads(result)
    importDotTopicAttachmentss(parsed)
    return jsonify({"success": True})


@bp.route('/<id>',  methods=['DELETE'])
@require_oauth()
def deletebyId(id):
    deleteById(id)
    return jsonify({"success": True})
