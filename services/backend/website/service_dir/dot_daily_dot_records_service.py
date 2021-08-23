from authlib.integrations.flask_oauth2 import current_token

from website.model_dir.base_model import db
from website.model_dir.dot_daily_dot_records import DotDailyDotRecords
from website.model_dir.dot_admin_daily_dot_records import DotAdminDailyDotRecords
from website.utils_dir.common_utils import getSort
from sqlalchemy import or_, and_, null, func, text


def createDotDailyDotRecords(dotDailyDotRecordsJson):
    dotDailyDotRecords = DotDailyDotRecords()
    dotDailyDotRecords = dotDailyDotRecords.as_model(dotDailyDotRecordsJson)
    if "option_1" in dotDailyDotRecordsJson and dotDailyDotRecordsJson['option_1'] is not null():
        dotDailyDotRecords.option1 = dotDailyDotRecordsJson['option_1']
    if "option_2" in dotDailyDotRecordsJson and dotDailyDotRecordsJson['option_2'] is not null():
        dotDailyDotRecords.option2 = dotDailyDotRecordsJson['option_2']
    if "option_3" in dotDailyDotRecordsJson and dotDailyDotRecordsJson['option_3'] is not null():
        dotDailyDotRecords.option3 = dotDailyDotRecordsJson['option_3']
    if "option_4" in dotDailyDotRecordsJson and dotDailyDotRecordsJson['option_4'] is not null():
        dotDailyDotRecords.option4 = dotDailyDotRecordsJson['option_4']

    dotDailyDotRecords.save()
    return dotDailyDotRecords


def updateDotDailyDotRecords(dotDailyDotRecordsJson):
    dotDailyDotRecords = DotDailyDotRecords()
    #dotDailyDotRecords = dotDailyDotRecords.as_model(dotDailyDotRecordsJson)
    dotDailyDotRecords.daily_dot_rec_id = dotDailyDotRecordsJson['daily_dot_rec_id']
    dotDailyDotRecords.record_response = dotDailyDotRecordsJson['record_response']
    if "option_1" in dotDailyDotRecordsJson and dotDailyDotRecordsJson['option_1'] is not null():
        dotDailyDotRecords.option1 = dotDailyDotRecordsJson['option_1']
    if "option_2" in dotDailyDotRecordsJson and dotDailyDotRecordsJson['option_2'] is not null():
        dotDailyDotRecords.option2 = dotDailyDotRecordsJson['option_2']
    if "option_3" in dotDailyDotRecordsJson and dotDailyDotRecordsJson['option_3'] is not null():
        dotDailyDotRecords.option3 = dotDailyDotRecordsJson['option_3']
    if "option_4" in dotDailyDotRecordsJson and dotDailyDotRecordsJson['option_4'] is not null():
        dotDailyDotRecords.option4 = dotDailyDotRecordsJson['option_4']

    dotDailyDotRecords.update()
    return dotDailyDotRecords


def findById(id):
    return DotDailyDotRecords.query.get(id)


def findAll(page, per_page, sort_column):
    return DotDailyDotRecords.query.order_by(getSort(sort_column)).paginate(page, per_page, error_out=False)


def findBy(page_size, **kwargs):
    condition_arr = []
    for col, val in kwargs.items():
        condition_arr.append(getattr(DotDailyDotRecords, col).__eq__(f'{val}%'))
    condition = and_(*condition_arr)
    if page_size == "all":
        return DotDailyDotRecords.query.filter(condition).order_by(getSort("record_date, desc")).all()
    else:
        return DotDailyDotRecords.query.filter(condition).order_by(getSort("record_date, desc")).limit(page_size).all()


def importDotDailyDotRecordss(dotDailyDotRecordssJson):
    modelList = []
    for i in dotDailyDotRecordssJson:
        dotDailyDotRecords = DotDailyDotRecords()
        dotDailyDotRecords = dotDailyDotRecords.as_model(i)
        modelList.append(dotDailyDotRecords)
    dotDailyDotRecords = DotDailyDotRecords()
    dotDailyDotRecords.saveAll(modelList)


def deleteById(id):
    dotDailyDotRecords = findById(id)
    dotDailyDotRecords.delete()


def dailyDotStreak():
    streak_query = text("""SELECT 
    dot_daily_dot_records.daily_dot_id AS dot_daily_dot_records_daily_dot_id,
    COUNT(dot_daily_dot_records.daily_dot_rec_id) AS streak
FROM
    dot_daily_dot_records
WHERE
    dot_daily_dot_records.record_date BETWEEN CURDATE() - INTERVAL 30 DAY AND CURDATE()
        AND dot_daily_dot_records.user_id = ':user_id'
GROUP BY dot_daily_dot_records.daily_dot_id
ORDER BY dot_daily_dot_records.daily_dot_id""").bindparams(user_id=current_token.user.id)
    streakResult = db.session.execute(streak_query)
    streakMap = []
    for sr in streakResult:
        streakMap.append({sr.dot_daily_dot_records_daily_dot_id:sr.streak})
    return streakMap


def generateDailydotRecords():
    dailyDotsMaster = DotAdminDailyDotRecords.query.filter(DotAdminDailyDotRecords.record_date == func.current_date()).all()
    for dailyDots in dailyDotsMaster:
        dotDailyDotRecords = DotDailyDotRecords()
        dotDailyDotRecords.record_date = dailyDots.record_date
        dotDailyDotRecords.record_title = dailyDots.record_title
        dotDailyDotRecords.record_description = dailyDots.record_description
        dotDailyDotRecords.option1 = dailyDots.option1
        dotDailyDotRecords.option2 = dailyDots.option2
        dotDailyDotRecords.option3 = dailyDots.option3
        dotDailyDotRecords.option4 = dailyDots.option4
        dotDailyDotRecords.daily_dot_id = dailyDots.daily_dot_id
        dotDailyDotRecords.user_id = current_token.user.id
        dotDailyDotRecords.save()
    return True