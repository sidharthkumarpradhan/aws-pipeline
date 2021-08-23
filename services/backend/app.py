from website.app import create_app


app = create_app({
    'SECRET_KEY': 'secret',
    'OAUTH2_REFRESH_TOKEN_GENERATOR': True,
    'SQLALCHEMY_TRACK_MODIFICATIONS': False,
    'SQLALCHEMY_DATABASE_URI': 'mysql+pymysql://dotx_dev:dotexpressdb!21@dotx-dev.cpdjfpiee5t9.ap-south-1.rds.amazonaws.com:3306/dotexpress',
    'SQLALCHEMY_ECHO': True,
    'UPLOAD_FOLDER': '/data/dotexpress/services/backend/uploads/',
    'ALLOWED_EXTENSIONS': ('txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'),
    'GET_FILE_SERVICE_URL': 'http://dev.dotx.co.in/api/v1/dot-files/get_file/',
    'SITEURL' : 'http://dev.dotx.co.in',
    ## SMTP Config
    'MAIL_SERVER': 'smtp.gmail.com',
    'MAIL_PORT': 587,
    'MAIL_USERNAME': 'dotxec2dev@gmail.com',
    'MAIL_PASSWORD': 'Osicpl@1',
    'MAIL_USE_TLS': True,
    'MAIL_USE_SSL': False,
    ## S3 Configuration
    'BUCKET': 'dot-expressbucket-dev-apsouth1',
    'S3_FOLDER': 'uploads/',
    'S3_ASSETS_FOLDER': 'assets/'

})

