from flask import jsonify, request, redirect, url_for, make_response, send_from_directory
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (JWTManager, jwt_required, create_access_token, get_jwt_identity)
from app import app
import sys, os, re
import pickle, datetime, time
import requests
#import data.NaiveBayesTextClassifier as nb


### ===== CONST VARIABLES ===== ###

res_code = {
    'SUCCESS': 200,
    'BAD_REQ': 400,
    'UNAUTH': 401,
    'NOTFOUND': 404,
    'INTERNAL_ERR': 500
}


### ===== CONFIG ===== ###

sys.path.append('data')

PORT = os.environ.get('PORT','8088')

app.config['MONGO_URI'] = os.environ.get('MONGODB_URI','mongodb://localhost/ham-spam-flask')

bcrypt = Bcrypt(app)
mongo = PyMongo(app)
jwt = JWTManager(app)

app.config['JWT_SECRET_KEY'] = 'pov3try'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(days=1)


### ===== FUNCTIONS===== ###

## clean the text
def __cleanse_instance(s):
    punctuation_list = [ "?", ".", ",", "/", "!" ]
    for punc in punctuation_list: s = s.replace(punc,"")
    return s.lower()

## convert epoch to datetime string
def __convert_datetime(time_str,time_required=True):
    if time_required:
        return time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(float(time_str)))
    return time.strftime('%Y-%m-%d', time.localtime(float(time_str)))


### ===== ROUTES ===== ###

@app.errorhandler(res_code['NOTFOUND'])
def not_found(error):
    return make_response(jsonify({
        'error': "route \'"+request.path+"\' is not found",
        'success': False
    }), res_code['NOTFOUND'])


@jwt.unauthorized_loader
def unauthorized_response(callback):
    return jsonify({'message': 'missing Authorization Header', 'success': False}), res_code['UNAUTH']


@app.route('/')
def index():
    return make_response(jsonify({
        'message': 'welcome to Flask App',
        'success': True
    }), res_code['SUCCESS'])


@app.route('/index')
@app.route('/home')
def to_index(): return redirect(url_for('index'))


@app.route('/api')
def api_index():
    return make_response(jsonify({
        'message': 'API index',
        'success': True
    }), res_code['SUCCESS'])


@app.route('/api/classify', methods=['POST'])
def api_classify():
    if request.method == 'POST': 
        model = None
        # open model
        with open('data/nb_model.pickle','rb') as f: model = pickle.load(f)
        data = request.json
        #'''
        if not data.get('text', None): 
            return jsonify({'message': 'text is empty', 'success': False}), res_code['BAD_REQ']
        #'''
        text = __cleanse_instance(data.get('text'))
        # do classification
        words = text.split()
        if not words: 
            return jsonify({'message': 'text is empty', 'success': False}), res_code['BAD_REQ']
        result = model.classify(words)
        return make_response(jsonify({
            'result': result,
            'success': True
        }), res_code['SUCCESS'])
    else:
        return jsonify({'message': '', 'success': False}), res_code['BAD_REQ']



@app.route('/api/users/register', methods=['POST'])
def create_new_user():
    if request.method == 'POST':

        data = request.json
        print (data)

        # check if username/email/password is missing or empty string
        if not data.get('username') or not data.get('email') or not data.get('password'): 
            return jsonify({'bad request': 'username email password cannot be empty, ', 'success': False}), res_code['BAD_REQ']
        
        # check if email exists
        existing_email = mongo.db.users.find_one({'email': data.get('email')})
        print(existing_email)
        if existing_email: 
            return jsonify({'bad request': 'email exists', 'success': False}), res_code['BAD_REQ']
        
        # use bcrypt to hash password and update
        password_hash = bcrypt.generate_password_hash(data.get('password')).decode('utf-8')
        
        timestamp = str(datetime.datetime.now().timestamp())
        new_data = {
            'username': data.get('username'),
            'email': data.get('email'),
            'password': password_hash,
            'date_join': timestamp,
            'last_login': timestamp
        }

        # create new user
        new_user = mongo.db.users.insert_one(new_data)
        _id = new_user.inserted_id
        
        token = create_access_token(identity=str(_id))
        print(token)
        
        resp = make_response(jsonify({'message': 'user registered successfully', 'success': True}), res_code['SUCCESS'])
        resp.headers['x-token'] = token
        return token
    else:
        return jsonify({'message': 'bad request', 'success': False}), res_code['BAD_REQ']


@app.route('/api/users/login', methods=['POST'])
def user_login():
    if request.method == 'POST':
        data = request.json
        
        # check if email password is empty string
        if not data.get('email') or not data.get('password'):
            return jsonify({
              'bad request': 'email password cannot be empty, ', 'success': False}), res_code['BAD_REQ']

        # check if user exists
        check_user = mongo.db.users.find_one({'email': data.get('email')})
        if not check_user:
            return jsonify({'message': 'user not found', 'success': False}), res_code['UNAUTH']
        
        # check if password matches
        password_match = bcrypt.check_password_hash(check_user['password'], data.get('password'))
        if not password_match:
            return jsonify({'message': 'incorrect password', 'success': False}), res_code['UNAUTH']

        _id = check_user['_id']

        # save last login detail
        timestamp = str(datetime.datetime.now().timestamp())
        mongo.db.users.update_one(
            {'_id': check_user['_id']},
            {'$set': {'last_login': timestamp}}
        )
        print(_id, check_user['username'], check_user['email'])

        token = create_access_token(identity=str(_id))
        print(token)

        resp = make_response(jsonify({'message': 'user login successfully', 'success': True}), res_code['SUCCESS'])
        resp.headers['x-token'] = token
        return resp 
    else:
        return jsonify({'message': 'bad request', 'success': False}), res_code['BAD_REQ']



@app.route('/api/users/profile', methods=['GET'])
@jwt_required
def get_profile():
    _id = get_jwt_identity()
    
    user = mongo.db.users.find_one({'_id': ObjectId(_id)})
    if not user:
        return jsonify({'message': 'user not found','success': False}), res_code['NOTFOUND']

    saved_texts = []
    for saved in mongo.db.texts.find({'author': ObjectId(_id)}):
        saved_texts.append({
            '_id': saved.get('_id'),
            'text': saved.get('text'),
            'label': saved.get('label','')
        })

    user_obj = {
        'username': user.get('username'),
        'email': user.get('email'),
        'date_join': __convert_datetime(user.get('date_join'), time_required=False),
        'last_login': __convert_datetime(user.get('last_login')),
        'saved_texts': saved_texts
    }
    print(user_obj)
    
    return jsonify({
        'message': 'got profile', 
        'data': user_obj,
        'success': True}), res_code['SUCCESS']


### ===== MAIN ===== ###

if __name__ == '__main__':
    app.config['DEBUG'] = os.environ.get('ENV','development') == 'development'
    app.run(host='0.0.0.0', port=int(PORT))
