from flask import jsonify, request, make_response
from bson.objectid import ObjectId
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
from flask_app import app, mongo, bcrypt, jwt
import flask_app.var_func as vf


### ===== ROUTES ===== ###

@jwt.unauthorized_loader
def unauthorized_response(callback):
    return jsonify({'message': 'missing Authorization Header', 'success': False}), vf.res_code['UNAUTH']


@app.route('/api/users/register', methods=['POST'])
def create_new_user():
    if request.method == 'POST':

        data = request.json
        print (data)

        # check if username/email/password is missing or empty string
        if not data.get('username') or not data.get('email') or not data.get('password'): 
            return jsonify({'message': 'username email password cannot be empty, ', 'success': False}), vf.res_code['BAD_REQ']
        
        # check if email exists
        existing_email = mongo.db.users.find_one({'email': data.get('email')})
        print(existing_email)
        if existing_email: 
            return jsonify({'message': 'email exists', 'success': False}), vf.vf.res_code['BAD_REQ']
        
        # use bcrypt to hash password and update
        password_hash = bcrypt.generate_password_hash(data.get('password')).decode('utf-8')
        
        timestamp = str(vf.get_timestamp())
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
        
        resp = make_response(jsonify({'message': 'user registered successfully', 'success': True, 'x-token': token}), vf.res_code['SUCCESS'])
        resp.headers['x-token'] = token
        return resp
    else:
        return jsonify({'message': 'bad request', 'success': False}), vf.res_code['BAD_REQ']


@app.route('/api/users/login', methods=['POST'])
def user_login():
    if request.method == 'POST':
        data = request.json
        
        # check if email password is empty string
        if not data.get('email') or not data.get('password'):
            return jsonify({
              'message': 'email password cannot be empty, ', 'success': False}), vf.res_code['BAD_REQ']

        # check if user exists
        check_user = mongo.db.users.find_one({'email': data.get('email')})
        if not check_user:
            return jsonify({'message': 'user not found', 'success': False}), vf.res_code['UNAUTH']
        
        # check if password matches
        password_match = bcrypt.check_password_hash(check_user['password'], data.get('password'))
        if not password_match:
            return jsonify({'message': 'incorrect password', 'success': False}), vf.res_code['UNAUTH']

        _id = check_user['_id']

        # save last login detail
        timestamp = str(vf.get_timestamp())
        mongo.db.users.update_one(
            {'_id': check_user['_id']},
            {'$set': {'last_login': timestamp}}
        )
        print(_id, check_user['username'], check_user['email'])

        token = create_access_token(identity=str(_id))
        print(token)

        resp = make_response(jsonify({'message': 'user login', 'success': True, 'x-token': token}), vf.res_code['SUCCESS'])
        resp.headers['x-token'] = token
        print(resp)
        return resp 
    else:
        return jsonify({'message': 'bad request', 'success': False}), vf.res_code['BAD_REQ']


@app.route('/api/users/profile', methods=['GET'])
@jwt_required
def get_profile():
    _id = get_jwt_identity()
    # get user
    user = mongo.db.users.find_one({'_id': ObjectId(_id)})
    if not user:
        return jsonify({'message': 'user not found','success': False}), vf.res_code['NOTFOUND']
    # get user saved texts
    saved_texts = []
    for saved in mongo.db.texts.find({'author': ObjectId(_id)}):
        saved_texts.append({
            '_id': str(saved.get('_id')),
            'text': saved.get('text'),
            'label': saved.get('label',''),
            'date_modified': vf.convert_datetime(saved.get('date_modified'))
        })
    # put in object
    user_obj = {
        'username': user.get('username'),
        'email': user.get('email'),
        'date_join': vf.convert_datetime(user.get('date_join'), time_required=False),
        'last_login': vf.convert_datetime(user.get('last_login')),
        'saved_texts': saved_texts
    }
    print(user_obj)
    return jsonify({
        'message': 'got profile', 
        'data': user_obj,
        'success': True
    }), vf.res_code['SUCCESS']
