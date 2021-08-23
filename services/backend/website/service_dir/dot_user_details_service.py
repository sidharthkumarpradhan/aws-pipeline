import os

from authlib.integrations.flask_oauth2 import current_token

from website.exceptions_dir.base_exceptions import BadRequest
from website.model_dir.base_model import db
from website.model_dir.dot_user_details import DotUserDetails
from website.model_dir.dot_user_skills import DotUserSkills
from website.model_dir.dot_skill_details import DotSkillDetails
from website.model_dir.oauth_models import User
from website.model_dir.dot_joincode_details import DotJoincodeDetails
from website.utils_dir.common_utils import getSort, ran_gen, my_dictionary
from website.utils_dir.common_utils import getSort, encrypt_message, decrypt_message
from website.service_dir.dot_email_notifications import sendEmail
from sqlalchemy import or_, and_, extract, func, text
from werkzeug.security import generate_password_hash
from datetime import datetime
from flask import current_app
from password_generator import PasswordGenerator


def createDotUserDetails(dotUserDetailsJson):
    checkDotUserDetails = DotUserDetails.query.filter(or_(DotUserDetails.user_email == dotUserDetailsJson["user_email"], DotUserDetails.user_gmail == dotUserDetailsJson["user_email"])).first()
    if checkDotUserDetails is None:
        dotUserDetails = DotUserDetails()
        dotUserDetails = dotUserDetails.as_model(dotUserDetailsJson)
        dotUserDetails.user_type = dotUserDetails.user_type
        dotUserDetails.user_phone_num = encrypt_message(dotUserDetails.user_phone_num)
        dotUserDetails.save()
        user = User()
        passwordd = generatePassword()
        password_hash = generate_password_hash(passwordd)
        user_data = User(id=dotUserDetails.user_id, username=dotUserDetailsJson['user_email'], password=password_hash)
        user_data.save()
        dotUserDetails.user_phone_num = decrypt_message(dotUserDetails.user_phone_num)
        emailData = {}
        emailData['subject'] = "DotX Admin User Onboarding"
        emailData['to'] = dotUserDetailsJson["user_email"]
        emailData['SITEURL'] = current_app.config.get("SITEURL")
        emailData['DISPLAYNAME'] = dotUserDetailsJson["display_name"]
        emailData['USERNAME'] = dotUserDetailsJson["user_email"]
        emailData['PASSWORD'] = passwordd
        emailData['TYPE'] = "adminuser"
        sendEmail(emailData)
        return dotUserDetails
    else:
        error = "Email already exist"
        raise BadRequest(error)


def updateDotUserDetails(dotUserDetailsJson):
    if 'user_id' not in dotUserDetailsJson:
        error = "Missing UserID"
        raise BadRequest(error)
    if 'user_phone_num' in dotUserDetailsJson:
        dotUserDetailsJson['user_phone_num'] = encrypt_message(dotUserDetailsJson['user_phone_num'])
    dotUserDetails = DotUserDetails()
    dotUserDetails = dotUserDetails.as_model(dotUserDetailsJson)
    #if "avatar_image_file" in dotUserDetailsJson:
        #dotUserDetails.avatar_image_file = os.path.join(current_app.config.get("GET_FILE_SERVICE_URL"), dotUserDetails.avatar_image_file)
    dotUserDetails.update()
    dotUserDetails.user_phone_num = decrypt_message(dotUserDetails.user_phone_num)
    return dotUserDetails


def findById(id):
    dotUserDetails = DotUserDetails.query.get(id)
    dotUserDetails.user_phone_num = decrypt_message(dotUserDetails.user_phone_num)
    return dotUserDetails


def findAll(page, per_page, sort_column):
    dotUserDetails = DotUserDetails.query.order_by(getSort(sort_column)).paginate(page, per_page, error_out=False)
    return dotUserDetails


def findBy(**kwargs):
    condition_arr = []
    for col, val in kwargs.items():
        condition_arr.append(getattr(DotUserDetails, col).ilike(f'{val}%'))
    condition = and_(*condition_arr)
    dotUserDetails = DotUserDetails.query.filter(condition).all()
    return dotUserDetails


def importDotUserDetailss(dotUserDetailssJson):
    modelList = []
    for i in dotUserDetailssJson:
        dotUserDetails = DotUserDetails()
        dotUserDetails = dotUserDetails.as_model(i)
        modelList.append(dotUserDetails)
    dotUserDetails = DotUserDetails()
    dotUserDetails.saveAll(modelList)


def deleteById(id):
    dotUserDetails = findById(id)
    dotUserDetails.delete()


def createUser(user_email):
    user = current_token.user
    generatedPassword = generatePassword()
    password_hash = generate_password_hash('test123')
    user_data = User(username=user_email, password=password_hash)
    user_data.save()
    joincode = ran_gen(10, "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890")
    user_type = 'admin'
    dotUserDetails = DotUserDetails.query.filter(DotUserDetails.user_id == user.id).first()
    user_type = dotUserDetails.user_type

    dot_joincode_details = DotJoincodeDetails(joincode=joincode, user_email=user_email, expired_flag=0, invited_by = user_type)
    dot_joincode_details.save()
    dot_user_details_data = DotUserDetails(user_id=user_data.id, user_type='student',
                                             user_email=user_email, is_temp_passwd=1,
                                             date_of_creation=datetime.now().strftime('%Y-%m-%dT%H:%M:%S'), joincode_id=dot_joincode_details.joincode_id)
    dot_user_details_data.save()
    dict_obj = my_dictionary()
    dict_obj.add('user_id', user_data.id)
    dict_obj.add('joincode_id', dot_joincode_details.joincode_id)
    dict_obj.add('joincode', dot_joincode_details.joincode)
    emailData = {}
    emailData['subject'] = "DotX Admin User Onboarding"
    emailData['to'] = user_email
    emailData['SITEURL'] = current_app.config.get("SITEURL")
    emailData['DISPLAYNAME'] = 'Student'
    emailData['USERNAME'] = user_email
    emailData['PASSWORD'] = "test123"
    emailData['JOINCODE'] = dot_joincode_details.joincode
    emailData['TYPE'] = 'joincode'
    #sendEmail(emailData)
    return dict_obj


def buddySearch(searchJSON):
    filter = ""
    join = ""
    topic_id = searchJSON["topic_id"]
    if "school_name" in searchJSON:
        filter = " AND LOWER(school_name) LIKE LOWER('"+searchJSON["school_name"]+"%') and ud.user_id <> "+str(current_token.user.id)
        dotUserDetails = DotUserDetails.query.filter(and_(DotUserDetails.user_type == "student", getattr(DotUserDetails, "school_name", DotUserDetails.user_id != current_token.user.id).ilike(f'{searchJSON["school_name"]}%'))).all()
    if "class_details" in searchJSON:
        filter = " AND LOWER(class_details) LIKE LOWER('"+searchJSON["class_details"]+"%') and ud.user_id <> "+ str(current_token.user.id)
        dotUserDetails = DotUserDetails.query.filter(and_(DotUserDetails.user_type == "student", getattr(DotUserDetails, "class_details", DotUserDetails.user_id != current_token.user.id).ilike(f'{searchJSON["class_details"]}%'))).all()
    if "display_name" in searchJSON:
        filter = " AND LOWER(display_name) LIKE LOWER('"+searchJSON["display_name"]+"%') and ud.user_id <> "+str(current_token.user.id)
        dotUserDetails = DotUserDetails.query.filter(and_(DotUserDetails.user_type == "student", getattr(DotUserDetails, "display_name").ilike(f'{searchJSON["display_name"]}%'), DotUserDetails.user_id != current_token.user.id)).all()
    if "skill" in searchJSON:
        filter = " AND LOWER(skill_name) LIKE LOWER('"+searchJSON["skill"]+"%') and  ud.user_id <> " + str(current_token.user.id)
        join = """ join
    dot_user_skills us on us.user_id = ud.user_id
		join
	dot_skill_details sd on sd.skill_id = us.skill_id """
        dotUserDetails = DotUserDetails.query.join(DotUserSkills, DotUserSkills.user_id == DotUserDetails.user_id).join(DotSkillDetails, DotSkillDetails.skill_id == DotUserSkills.skill_id).filter(and_(DotUserDetails.user_type == "student", getattr(DotSkillDetails, "skill_name").contains(f'{searchJSON["skill"]}%'))).all()
    if "age" in searchJSON:
        filter = " AND  ud.user_id <> "+ str(current_token.user.id) + " AND FLOOR(DATEDIFF( now(), user_dob)/365) = "+ searchJSON["age"]
        dotUserDetails = DotUserDetails.query.filter(and_(DotUserDetails.user_type == "student", func.floor(func.DATEDIFF( func.now(), DotUserDetails.user_dob)/365) == searchJSON["age"])).all()
    sql = """SELECT 
    *
FROM
    dot_user_details ud
        LEFT OUTER JOIN 
    dot_topic_assignments ta on ta.user_id = ud.user_id  and ta.topic_id = ':topic_id'
        LEFT OUTER JOIN
    dot_topic_group_roles tgr on role_assigned_to = ud.user_email and tgr.group_id = ta.group_id  """ + join + """WHERE
    ud.user_type = 'student' """ + filter + """ order by display_name """
    t = text(sql).bindparams(topic_id=topic_id)
    dotUserDetails = db.session.execute(t)
    return dotUserDetails


def buddySearchs(searchJSON):
    filter = " where ud.user_id <> "+str(current_token.user.id)
    join = ""
    if "school_name" in searchJSON:
        filter += " AND LOWER(school_name) LIKE LOWER('"+searchJSON["school_name"]+"%')"
    if "class_details" in searchJSON:
        filter += " AND LOWER(class_details) LIKE LOWER('"+searchJSON["class_details"]+"%')"
    if "display_name" in searchJSON:
        filter += " AND LOWER(display_name) LIKE LOWER('"+searchJSON["display_name"]+"%')"
    if "skill" in searchJSON:
        filter += " AND LOWER(skill_name) LIKE LOWER('"+searchJSON["skill"]+"%')"
        join = """ LEFT JOIN
    dot_user_skills us ON us.user_id = ud.user_id  and ud.user_id <> '"""+ str(current_token.user.id) +"""'
        LEFT JOIN
    dot_skill_details sd ON sd.skill_id = us.skill_id """
    if "age" in searchJSON:
        filter += "  AND FLOOR(DATEDIFF( now(), user_dob)/365) = "+ searchJSON["age"]
    t = text("""SELECT 
            ud.*
        FROM
            dot_user_details ud
                JOIN
            dot_topic_assignments ta ON ta.user_id = ud.user_id
                AND ta.group_id IN (SELECT 
                    tg.group_id
                FROM
                    dot_topic_assignments ta1
                        JOIN
                    dot_topic_group tg ON ta1.group_id = tg.group_id
                WHERE
                    ta1.user_id = ':user_id') """ + join + filter + """
        GROUP BY user_id""").bindparams(user_id=current_token.user.id)
    dotUserDetails = db.session.execute(t)
    return dotUserDetails



def buddySearchByGroup():
    t = text("""SELECT 
    ud1.user_id, 
    ud1.user_type, 
    ud1.display_name, 
    ud1.user_phone_num, 
    ud1.user_email, 
    ud1.user_gmail, 
    ud1.avatar_image_file, 
    ud1.school_name,
    ud1.class_details, 
    ud1.user_dob,
    
FROM
    dot_user_details ud1
		join
	dot_topic_assignments ta1
		on ud1.user_id = ta1.user_id
        where ta1.group_id in
    (SELECT 
        group_id
    FROM
        dot_topic_assignments ta
    WHERE
        ta.user_id = ':user_id' AND group_id IS NOT NULL) and ta1.group_id is not null group by ud1.user_id""").bindparams(user_id=current_token.user.id)
    dotUserDetailss = db.session.execute(t)
    return dotUserDetailss


def forgotPassword(EmailJSON):
    dotUserDetailss = DotUserDetails.query.filter(DotUserDetails.user_email == EmailJSON['user_email']).first()
    if dotUserDetailss is None:
        return {"failure": "Email Id does not match"}
    else:
        UserDetails = User.query.filter(User.username == EmailJSON['user_email']).first()
        userid = UserDetails.id
        passwordd = generatePassword()
        password_hash = generate_password_hash(passwordd)
        UserDetails.password = password_hash
        db.session.commit()
        dotUserDetailss.is_temp_passwd = 1
        db.session.commit()
        emailData = {}
        emailData['subject'] = "Reset Your DotX Password"
        emailData['to'] = EmailJSON['user_email']
        emailData['SITEURL'] = current_app.config.get("SITEURL")
        emailData['DISPLAYNAME'] = 'Student'
        emailData['USERNAME'] = EmailJSON['user_email']
        emailData['PASSWORD'] = passwordd
        emailData['TYPE'] = 'forgot_password'
        sendEmail(emailData)
        return {"success": "Temperary password is sent to the given Email-id."}


def generatePassword():
    pwo = PasswordGenerator()
    pwo.excludeschars = ")(_-*%^&><+=][}{:;?,.~`"
    pwo.maxlen = 8
    pwo.minnumbers = 2
    return pwo.generate()


def resetPassword(form_data):
    return_obj = my_dictionary()
    user_data = current_token.user
    user = User.query.filter_by(id=user_data.id).first()
    current_password = form_data['current_password']
    if user is not None and user.check_password(current_password):
        if form_data['new_password'] == form_data['confirm_password']:
            user.password = generate_password_hash(form_data['new_password'])
            db.session.commit()
            dotUserDetailss = DotUserDetails.query.filter(DotUserDetails.user_id == user_data.id).first()
            if dotUserDetailss is not None:
                dotUserDetailss.is_temp_passwd = 0
                db.session.commit()
                return_obj.add('success', 'Password updated successfully')
            else:
                return_obj.add('error', 'Something went wrong, please contact administrator')
            return return_obj
        else:
            return_obj.add('error', 'new password and confirm password does not match')
            return return_obj
    else:
        return_obj.add('error', 'Invalid current password')
        return return_obj


def createlogin(dotUserDetailsJSON):
    return_obj = my_dictionary()
    user_data = current_token.user
    dotUserDetailss = {}
    checkUser = User.query.filter_by(username=dotUserDetailsJSON['user_email']).first()
    if checkUser is not None:
        error = "Email already exist"
        raise BadRequest(error)
    user = User.query.filter_by(id=user_data.id).first()
    if user is not None:
        if dotUserDetailsJSON['new_password'] == dotUserDetailsJSON['confirm_password']:
            user.password = generate_password_hash(dotUserDetailsJSON['new_password'])
            user.username = dotUserDetailsJSON['user_email']
            user.update()
            dotUserDetailss = DotUserDetails.query.filter(DotUserDetails.user_id == user_data.id).first()
            if dotUserDetailss is not None:
                dotUserDetailss.is_temp_passwd = 0
                dotUserDetailss.user_email = dotUserDetailsJSON['user_email']
                dotUserDetailss.update()
                return_obj.add('success', 'Password updated successfully')
            else:
                return_obj.add('error', 'Something went wrong, please contact administrator')
                return return_obj
        else:
            return_obj.add('error', 'new password and confirm password does not match')
            return return_obj
    else:
        return_obj.add('error', 'Something went wrong, please contact administrator')
        return return_obj
    return dotUserDetailss



def createStudent(dotUserDetailsJSON):
    return_obj = my_dictionary()
    dotUserDetailss = {}
    if dotUserDetailsJSON['user_email'] is not None:
        verifyUser = User.query.filter(User.username == dotUserDetailsJSON['user_email']).first()
        verifyDotUser = DotUserDetails.query.filter(DotUserDetails.user_email == dotUserDetailsJSON['user_email']).first()
        if verifyUser is not None or verifyDotUser is not None:
            return_obj.add('error', 'Email Already in Use')
            return return_obj
        else:
            if dotUserDetailsJSON['new_password'] == dotUserDetailsJSON['confirm_password']:
                user = User()
                user.password = generate_password_hash(dotUserDetailsJSON['new_password'])
                user.username = dotUserDetailsJSON['user_email']
                user.save()
                dotUserDetailss = DotUserDetails()
                dotUserDetailss.is_temp_passwd = 0
                dotUserDetailss.user_email = dotUserDetailsJSON['user_email']
                dotUserDetailss.save()
                return dotUserDetailss
            else:
                return_obj.add('error', 'Email Already in Use')
                return return_obj



def generateJoincodes(count):
    joincodeMap = []
    for i in range(0, count):
        joincode = ran_gen(10, "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890")
        dot_joincode_details = DotJoincodeDetails(joincode=joincode, expired_flag=0)
        dot_joincode_details.save()
        joincodeMap.append({"joincode":joincode})
    sendJoinCodesEmail(joincodeMap)
    return joincode


def sendJoinCodesEmail(joincodeMap):
    emailData = {}
    emailData['subject'] = "DotX JoinCodes to platform"
    emailData['to'] = current_token.user.username
    emailData['SITEURL'] = current_app.config.get("SITEURL")
    emailData['JOINCODES'] = joincodeMap
    emailData['TYPE'] = 'admin_joincodes'
    sendEmail(emailData)


def myBuddies():
    t = text("""SELECT 
    ud.*
FROM
    dot_user_details ud
        JOIN
    dot_topic_assignments ta ON ta.user_id = ud.user_id
        AND ta.group_id IN (SELECT 
            tg.group_id
        FROM
            dot_topic_assignments ta1
                JOIN
            dot_topic_group tg ON ta1.group_id = tg.group_id
        WHERE
            ta1.user_id = ':user_id')
GROUP BY user_id""").bindparams(user_id=current_token.user.id)
    dotUserDetails = db.session.execute(t)
    return dotUserDetails


def generateBulkJoincodes(count):
    joincodeMap = []
    for i in range(0, count):
        password_hash = generate_password_hash('test123')
        joincode = ran_gen(10, "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890")
        user_data = User(username=joincode, password=password_hash)
        user_data.save()
        dot_joincode_details = DotJoincodeDetails(joincode=joincode, user_email=joincode, expired_flag=0, invited_by="admin")
        dot_joincode_details.save()
        dot_user_details_data = DotUserDetails(user_id=user_data.id, user_type='student',
                                               user_email=joincode, is_temp_passwd=1,
                                               date_of_creation=datetime.now().strftime('%Y-%m-%dT%H:%M:%S'),
                                               joincode_id=dot_joincode_details.joincode_id)
        dot_user_details_data.save()
        joincodeMap.append({'joincode': joincode})
        i += 1
    return joincodeMap