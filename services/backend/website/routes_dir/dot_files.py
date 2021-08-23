import os
import uuid
import boto3
from awscli.errorhandler import ClientError
from flask import Flask, Blueprint, request, send_file, current_app
from flask import jsonify
from sqlalchemy.testing.plugin.plugin_base import logging

from website.exceptions_dir.base_exceptions import BadRequest
from website.oauth2 import require_oauth
import ffmpeg

bp = Blueprint(__name__, 'dotFiles')


@bp.route('/upload', methods=['POST'])
@require_oauth()
def upload():
    if request.method == 'POST':
        files = request.files.getlist('file')
        fileType = request.form['type']
        # if user does not select file, browser also
        # submit an empty part without filename
        filesMap = []
        for file in files:
            if file.filename == '':
                return "No selected file"
            if file:
                original_filename = file.filename
                filename = None
                thumbNail = 'thumbnail.jpg'
                cropped_file_path = None
                if fileType == "avatar" and (
                        os.path.splitext(file.filename)[1] == ".jpeg" or os.path.splitext(file.filename)[1] == ".jpg" or
                        os.path.splitext(file.filename)[1] == ".png"):
                    file.filename = str(uuid.uuid1()) + ".png"
                elif (fileType == "challenge_badge" or fileType == "topic_badge") and (
                        os.path.splitext(file.filename)[1] == ".jpeg" or os.path.splitext(file.filename)[1] == ".jpg" or
                        os.path.splitext(file.filename)[1] == ".png"):
                    file.filename = str(uuid.uuid1()) + ".png"
                elif (fileType == "challenge_video" or fileType == "topic_video") and (os.path.splitext(file.filename)[1] == ".mp4"):
                    fileName = str(uuid.uuid1())
                    file.filename = fileName + ".mp4"

                elif (fileType == "challenge_audio" or fileType == "topic_audio") and (os.path.splitext(file.filename)[1] == ".mp3"):
                    file.filename = str(uuid.uuid1()) + ".mp3"
                elif (fileType == "challenge_image" or fileType == "topic_image") and (
                        os.path.splitext(file.filename)[1] == ".jpeg" or os.path.splitext(file.filename)[1] == ".jpg" or
                        os.path.splitext(file.filename)[1] == ".png"):
                    file.filename = str(uuid.uuid1()) + ".png"
                elif fileType == "challenge_document" or fileType == "topic_document" or fileType == "skill" or fileType == "challenge_comment" or fileType == "challenge_group_comment" or fileType == "reward_badge":
                    file.filename = str(uuid.uuid1()) + os.path.splitext(file.filename)[1]
                else:
                    error = "Unsupported file format"
                    raise BadRequest(error)

                filename = file.filename
                thumbNail = str(uuid.uuid1())+".jpg"
                file.save(os.path.join(current_app.config.get("S3_FOLDER"), filename))
                #generate_thumbnail(filename, thumbNail, 4, 200)
                response = upload_file(current_app.config.get("S3_FOLDER")+f"{filename}", current_app.config.get("BUCKET"))
                filesMap.append({'file': filename,'display_name': original_filename})
            else:
                error = "File not found"
                raise BadRequest(error)
        return jsonify(filesMap)


@bp.route('/get_file/<filename>', methods=["GET"])
def get_image(filename):
    ret_filename = os.path.join(current_app.config.get("UPLOAD_FOLDER"), filename)
    return send_file(ret_filename, as_attachment=False)


def upload_file(file_name, bucket):
    object_name = file_name
    s3_client = boto3.client('s3')
    response = s3_client.upload_file(file_name, bucket, object_name)
    return response


def generate_thumbnail(in_filename, out_filename, time, width):
    try:
        (
            ffmpeg
                .input(os.path.join(current_app.config.get("UPLOAD_FOLDER"), in_filename), ss=time)
                .filter('scale', width, -1)
                .output(os.path.join(current_app.config.get("UPLOAD_FOLDER"), out_filename), vframes=1)
                .run()
        )

    except ffmpeg.Error as e:
        raise BadRequest(e.stderr.decode())

@bp.route('/show_image/<file_name>', methods=["GET"])
def show_image(file_name):
    bucket_name = "dotx-raj"
    object_name = current_app.config.get("S3_FOLDER")+file_name
    s3_client = boto3.client('s3')
    response = s3_client.generate_presigned_url('get_object',
                                                    Params={'Bucket': bucket_name,
                                                            'Key': object_name},
                                                    ExpiresIn=60)
    return response

def download_file(file_name, bucket):
    """
    Function to download a given file from an S3 bucket
    """
    s3 = boto3.client('s3')
    output = f"downloads/{file_name}"
    s3.Bucket(bucket).download_file(file_name, output)
    return output


@bp.route('/upload_asset', methods=['POST'])
@require_oauth()
def upload_asset():
    files = request.files.getlist('file')
    for file in files:
        if file.filename == '':
            return "No selected file"
        if file:
            filename = None
            filename = file.filename
            filesMap = []
            file.save(os.path.join(current_app.config.get("S3_ASSETS_FOLDER"), filename))
            #response = upload_file(current_app.config.get("S3_ASSETS_FOLDER") + f"{filename}", current_app.config.get("BUCKET"))
            filesMap.append({'file': filename})
            return jsonify(filesMap)