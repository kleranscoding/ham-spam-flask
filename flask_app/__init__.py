from flask import Flask
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import json
import datetime
import os

app = Flask(__name__)

app.config['MONGO_URI'] = os.environ.get('MONGODB_URI','mongodb://localhost/ham-spam-flask')
app.config['JWT_SECRET_KEY'] = 'pov3try'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(days=1)

cors = CORS(app)
bcrypt = Bcrypt(app)
mongo = PyMongo(app)
jwt = JWTManager(app)

from flask_app.controllers import *
