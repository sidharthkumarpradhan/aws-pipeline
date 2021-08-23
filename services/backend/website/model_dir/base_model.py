from flask_sqlalchemy import SQLAlchemy
from authlib.integrations.flask_oauth2 import current_token
from sqlalchemy import text
from datetime import datetime
from website.utils_dir.common_utils import CustomSerializerMixin

db = SQLAlchemy()


class BaseModel(db.Model, CustomSerializerMixin):
    __abstract__ = True
    created_by = db.Column(db.String(255))
    lastmodified_by = db.Column(db.String(255))
    created_date = db.Column(db.DateTime, server_default=db.FetchedValue())
    lastmodified_date = db.Column(db.DateTime, server_default=db.FetchedValue())

    def before_save(self, *args, **kwargs):
        self.created_by = current_token.user.username
        self.lastmodified_by = current_token.user.username
        self.created_date = datetime.now().strftime('%Y-%m-%dT%H:%M:%S')
        self.lastmodified_date = datetime.now().strftime('%Y-%m-%dT%H:%M:%S')

    def after_save(self, *args, **kwargs):
        pass

    def save(self, commit=True):
        self.before_save()
        db.session.add(self)
        if commit:
            try:
                db.session.commit()
            except Exception as e:
                db.session.rollback()
                raise e

        self.after_save()

    def saveAll(self, _list, commit=True):
        # self.before_save()
        db.session.bulk_save_objects(_list)
        if commit:
            try:
                db.session.commit()
            except Exception as e:
                db.session.rollback()
                raise e
        # self.after_save()   

    def before_update(self, *args, **kwargs):
        self.lastmodified_by = current_token.user.username
        self.lastmodified_date = datetime.now().strftime('%Y-%m-%dT%H:%M:%S')

    def after_update(self, *args, **kwargs):
        pass

    def update(self, commit=True):
        self.before_update()
        db.session.merge(self)
        if commit:
            try:
                db.session.commit()
            except Exception as e:
                db.session.rollback()
                raise e
        self.after_update()

    def delete(self, commit=True):
        db.session.delete(self)
        if commit:
            try:
                db.session.commit()
            except Exception as e:
                db.session.rollback()
                raise e

    def as_dict(self):
        return self.to_dict()

    def list_as_dict(self, _list):
        listDict = []
        for i in _list:
            listDict.append(i)
        return listDict

    def as_model(self, _json):
        return self.schema_instance.load(_json)

    def list_as_model(self, _list):
        modelList = []
        for i in _list:
            modelList.append(self.as_model(i))
        return modelList
