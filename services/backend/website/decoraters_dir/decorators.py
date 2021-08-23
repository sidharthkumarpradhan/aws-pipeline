import marshmallow_sqlalchemy as ma
from website.model_dir.base_model import db


def add_schema(cls):
    class Schema(ma.SQLAlchemyAutoSchema):
        class Meta:
            model = cls
            sqla_session = db.session
            include_relationships = True
            load_instance = True
    cls.Schema = Schema
    cls.schema_instance = Schema()
    return cls
