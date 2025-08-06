from decouple import config # type: ignore

class Config:
    DB_HOST = config('DB_HOST')
    DB_NAME = config('DB_NAME')
    DB_USER = config('DB_USER')
    DB_PASSWORD = config('DB_PASSWORD')
    DB_PORT = config('DB_PORT', default=3306, cast=int)
    SECRET_KEY = config('FLASK_SECRET_KEY')
    DEBUG = config('DEBUG', default=False, cast=bool)

    @property
    def SQLALCHEMY_DATABASE_URI(self):
        return f"mysql+mysqlconnector://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"