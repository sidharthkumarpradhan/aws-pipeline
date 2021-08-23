from website.model_dir.dot_joincode_details import DotJoincodeDetails
from website.utils_dir.common_utils import getSort
from sqlalchemy import or_


def createDotJoincodeDetails(dotJoincodeDetailsJson):
    dotJoincodeDetails = DotJoincodeDetails()
    dotJoincodeDetails = dotJoincodeDetails.as_model(dotJoincodeDetailsJson)
    dotJoincodeDetails.save()
    return dotJoincodeDetails


def updateDotJoincodeDetails(dotJoincodeDetailsJson):
    dotJoincodeDetails = DotJoincodeDetails()
    dotJoincodeDetails = dotJoincodeDetails.as_model(dotJoincodeDetailsJson)
    dotJoincodeDetails.update()
    return dotJoincodeDetails


def findById(id):
    return DotJoincodeDetails.query.get(id)


def findAll(page, per_page, sort_column):
    return DotJoincodeDetails.query.order_by(getSort(sort_column)).paginate(page, per_page, error_out=False)


def findBy(**kwargs):
    condition_arr = []
    for col, val in kwargs.items():
        condition_arr.append(getattr(DotJoincodeDetails, col).ilike(f'{val}%'))
    condition = or_(*condition_arr)
    return DotJoincodeDetails.query.filter(condition).all()


def importDotJoincodeDetailss(dotJoincodeDetailssJson):
    modelList = []
    for i in dotJoincodeDetailssJson:
        dotJoincodeDetails = DotJoincodeDetails()
        dotJoincodeDetails = dotJoincodeDetails.as_model(i)
        modelList.append(dotJoincodeDetails)
    dotJoincodeDetails = DotJoincodeDetails()
    dotJoincodeDetails.saveAll(modelList)


def deleteById(id):
    dotJoincodeDetails = findById(id)
    dotJoincodeDetails.delete()
