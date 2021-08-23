from flask import Blueprint, current_app, render_template
from flask_mail import Message
from sqlalchemy import null


def sendEmail(emailData):
    msg = Message(emailData['subject'], sender='devbbsi@gmail.com', recipients=[emailData['to']])
    if emailData['TYPE'] == "joincode":
        msg.html = render_template("email_joincode.html",  SITEURL=emailData['SITEURL'], JOINCODE=emailData['JOINCODE'])
    elif emailData['TYPE'] == "adminuser":
        msg.html = render_template("email_admin_user_creation.html", DISPLAYNAME=emailData['DISPLAYNAME'], SITEURL=emailData['SITEURL'], USERNAME=emailData['USERNAME'], PASSWORD=emailData['PASSWORD'])
    elif emailData['TYPE'] == "challenge_share":
        msg.html = render_template("email_challenge_share.html", DISPLAYNAME=emailData['DISPLAYNAME'], SITEURL=emailData['SITEURL'], CHALLENGENAME=emailData['CHALLENGENAME'], CHALLENGEDESC=emailData['CHALLENGEDESC'])
    elif emailData['TYPE'] == "challenge_group_share":
        msg.html = render_template("email_challenge_group_share.html", DISPLAYNAME=emailData['DISPLAYNAME'], SITEURL=emailData['SITEURL'], USERNAME=emailData['USERNAME'], PASSWORD=emailData['PASSWORD'])
    elif emailData['TYPE'] == "forgot_password":
        msg.html = render_template("email_forgot_password.html", DISPLAYNAME=emailData['DISPLAYNAME'],
                                   SITEURL=emailData['SITEURL'], USERNAME=emailData['USERNAME'],
                                   PASSWORD=emailData['PASSWORD'])
    elif emailData['TYPE'] == "admin_joincodes":
        msg.html = render_template("admin_joincodes.html", SITEURL=emailData['SITEURL'], JOINCODES=emailData['JOINCODES'])
    elif emailData['TYPE'] == "reject_challenge_invite":
        msg.html = render_template("reject_challenge_invite.html", SITEURL=emailData['SITEURL'], DISPLAY_NAME=emailData['DISPLAY_NAME'], INVITE=emailData['INVITE'], GROUP_NAME=emailData['GROUP_NAME'], CHALLENGE_NAME=emailData['CHALLENGE_NAME'])

    current_app.mail.send(msg)