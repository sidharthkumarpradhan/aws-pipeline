
from website.model_dir.dot_admin_daily_dot_records import DotAdminDailyDotRecords
from website.utils_dir.common_utils import getSort
from sqlalchemy import or_


def createDotAdminDailyDotRecords(dotAdminDailyDotRecordsJson):
    dotAdminDailyDotRecords = DotAdminDailyDotRecords()
    dotAdminDailyDotRecords = dotAdminDailyDotRecords.as_model(dotAdminDailyDotRecordsJson)
    dotAdminDailyDotRecords.save()
    return dotAdminDailyDotRecords


def updateDotAdminDailyDotRecords(dotAdminDailyDotRecordsJson):
    dotAdminDailyDotRecords = DotAdminDailyDotRecords()
    dotAdminDailyDotRecords = dotAdminDailyDotRecords.as_model(dotAdminDailyDotRecordsJson)
    dotAdminDailyDotRecords.update()
    return dotAdminDailyDotRecords


def findById(id):
    return DotAdminDailyDotRecords.query.get(id)


def findAll(page, per_page, sort_column):
    return DotAdminDailyDotRecords.query.order_by(getSort(sort_column)).paginate(page, per_page, error_out=False)


def findBy(**kwargs):
    condition_arr = []
    for col, val in kwargs.items():
        condition_arr.append(getattr(DotAdminDailyDotRecords, col).ilike(f'{val}%'))
    condition = or_(*condition_arr)
    return DotAdminDailyDotRecords.query.filter(condition).all()


def importDotAdminDailyDotRecordss(dotAdminDailyDotRecordssJson):
    modelList = []
    for i in dotAdminDailyDotRecordssJson:
        dotAdminDailyDotRecords = DotAdminDailyDotRecords()
        dotAdminDailyDotRecords = dotAdminDailyDotRecords.as_model(i)
        if dotAdminDailyDotRecords.daily_dot_type == "Quote":
            dotAdminDailyDotRecords.daily_dot_id = 1
        elif dotAdminDailyDotRecords.daily_dot_type == "Anectode":
            dotAdminDailyDotRecords.daily_dot_id = 2
        elif dotAdminDailyDotRecords.daily_dot_type == "Poll":
            dotAdminDailyDotRecords.daily_dot_id = 3
        elif dotAdminDailyDotRecords.daily_dot_type == "Gratitude":
            dotAdminDailyDotRecords.daily_dot_id = 4
        modelList.append(dotAdminDailyDotRecords)
    dotAdminDailyDotRecords = DotAdminDailyDotRecords()
    dotAdminDailyDotRecords.saveAll(modelList)


def deleteById(id):
    dotAdminDailyDotRecords = findById(id)
    dotAdminDailyDotRecords.delete()
