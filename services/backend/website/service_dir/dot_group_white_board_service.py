from website.model_dir.dot_group_white_board import DotGroupWhiteBoard
from website.utils_dir.common_utils import getSort
from sqlalchemy import or_


def createDotGroupWhiteBoard(dotGroupWhiteBoardJson):
    dotGroupWhiteBoard = DotGroupWhiteBoard()
    dotGroupWhiteBoard = dotGroupWhiteBoard.as_model(dotGroupWhiteBoardJson)
    dotGroupWhiteBoard.save()
    return dotGroupWhiteBoard


def updateDotGroupWhiteBoard(dotGroupWhiteBoardJson):
    dotGroupWhiteBoard = DotGroupWhiteBoard()
    dotGroupWhiteBoard = dotGroupWhiteBoard.as_model(dotGroupWhiteBoardJson)
    dotGroupWhiteBoard.update()
    return dotGroupWhiteBoard


def findById(id):
    return DotGroupWhiteBoard.query.get(id)


def findAll(page, per_page, sort_column):
    return DotGroupWhiteBoard.query.order_by(getSort(sort_column)).paginate(page, per_page, error_out=False)


def findBy(**kwargs):
    condition_arr = []
    for col, val in kwargs.items():
        condition_arr.append(getattr(DotGroupWhiteBoard, col).ilike(f'{val}%'))
    condition = or_(*condition_arr)
    return DotGroupWhiteBoard.query.filter(condition).all()


def importDotGroupWhiteBoards(dotGroupWhiteBoardsJson):
    modelList = []
    for i in dotGroupWhiteBoardsJson:
        dotGroupWhiteBoard = DotGroupWhiteBoard()
        dotGroupWhiteBoard = dotGroupWhiteBoard.as_model(i)
        modelList.append(dotGroupWhiteBoard)
    dotGroupWhiteBoard = DotGroupWhiteBoard()
    dotGroupWhiteBoard.saveAll(modelList)


def deleteById(id):
    dotGroupWhiteBoard = findById(id)
    dotGroupWhiteBoard.delete()
