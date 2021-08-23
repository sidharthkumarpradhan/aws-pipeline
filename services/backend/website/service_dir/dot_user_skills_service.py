from website.model_dir.base_model import db

from authlib.integrations.flask_oauth2 import current_token
from website.model_dir.dot_skill_details import DotSkillDetails
from website.model_dir.dot_user_skills import DotUserSkills
from website.model_dir.dot_user_skill_attachment import DotUserSkillAttachment
from sqlalchemy import or_, and_, null, func, desc, text
from website.utils_dir.common_utils import getSort
from sqlalchemy import or_


def createDotUserSkills(dotUserSkillsJson):
    dotUserSkills = DotUserSkills()
    dotUserSkills = dotUserSkills.as_model(dotUserSkillsJson)
    dotUserSkills.save()
    return dotUserSkills


def updateDotUserSkills(dotUserSkillsJson):
    dotUserSkills = DotUserSkills()
    dotUserSkills = dotUserSkills.as_model(dotUserSkillsJson)
    dotUserSkills.update()
    return dotUserSkills


def findById(id):
    return DotUserSkills.query.get(id)


def findAll():
    t = text("""SELECT 
        sd.*,
        CASE
            WHEN user_skills.user_skill_id IS NOT NULL THEN 1
            ELSE 0
        END AS is_selected,
        attachments
    FROM
        dot_skill_details sd
            LEFT JOIN
        (SELECT 
            us.user_skill_id,
                skill_id,
                user_id,
                CONCAT('[',
                GROUP_CONCAT(CONCAT('{"file":"',
                            user_skill_file,
                            '", "display_name":"',
                            COALESCE(display_name, ''),
                            '"}')),
                ']') attachments
        FROM
            dot_user_skills us
        LEFT JOIN dot_user_skill_attachment usa ON usa.user_skill_id = us.user_skill_id
        WHERE
            user_id = ':user_id'
        GROUP BY us.user_skill_id) user_skills ON user_skills.skill_id = sd.skill_id""").bindparams(user_id=current_token.user.id)
    dotUserSkills = db.session.execute(t)
    return dotUserSkills


def findBy(**kwargs):
    condition_arr = []
    for col, val in kwargs.items():
        condition_arr.append(getattr(DotUserSkills, col).ilike(f'{val}%'))
    condition = or_(*condition_arr)
    return DotUserSkills.query.filter(condition).all()


def importDotUserSkillss(dotUserSkillssJson):
    modelList = []
    for i in dotUserSkillssJson:
        dotUserSkills = DotUserSkills()
        dotUserSkills = dotUserSkills.as_model(i)
        modelList.append(dotUserSkills)
    dotUserSkills = DotUserSkills()
    dotUserSkills.saveAll(modelList)


def bulk_addDotUserSkillss(dotUserSkillssJson):
    modelList = []
    for i in dotUserSkillssJson:
        dotUserSkills = DotUserSkills()
        dotUserSkills = dotUserSkills.as_model(i)
        dotUserSkills.save()


def deleteById(id):
    dotUserSkills = findById(id)
    dotUserSkills.delete()


def userSkillsByCategory(skill_category):
    t = text("""SELECT 
    sd.*,
    CASE
        WHEN user_skills.user_skill_id IS NOT NULL THEN 1
        ELSE 0
    END AS is_selected,
    others_option,
    attachments
FROM
    dot_skill_details sd
        LEFT JOIN
    (SELECT 
        us.user_skill_id,
            skill_id,
            others_option,
            user_id,
            CONCAT('[',
            GROUP_CONCAT(CONCAT('{"file":"',
                        user_skill_file,
                        '", "display_name":"',
                        COALESCE(display_name, ''),
                        '"}')),
            ']') attachments
    FROM
        dot_user_skills us
    LEFT JOIN dot_user_skill_attachment usa ON usa.user_skill_id = us.user_skill_id
    WHERE
        user_id = ':user_id'
    GROUP BY us.user_skill_id) user_skills ON user_skills.skill_id = sd.skill_id
        where skill_category = :skill_category """).bindparams(user_id=current_token.user.id, skill_category=skill_category)
    dotUserSkills = db.session.execute(t)
    return dotUserSkills

