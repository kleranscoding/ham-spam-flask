from flask import jsonify, request
from bson.objectid import ObjectId
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_app import app, mongo, jwt
import sys, os, re
import pickle, datetime, time


res_code = {
    'SUCCESS': 200,
    'BAD_REQ': 400,
    'UNAUTH': 401,
    'NOTFOUND': 404,
    'INTERNAL_ERR': 500
}


### ===== FUNCTIONS ===== ###

## convert epoch to datetime string
def __convert_datetime(time_str,time_required=True):
    if time_required:
        return time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(float(time_str)))
    return time.strftime('%Y-%m-%d', time.localtime(float(time_str)))


### ===== ROUTES ===== ###

@app.route('/api/text/new', methods=['POST'])
@jwt_required
def save_text():
    
    if not request.json or not request.json.get('text'):
        return jsonify({'message': 'text cannot be empty', 'success': False}), res_code['BAD_REQ']

    _id = get_jwt_identity()
    
    timestamp = str(datetime.datetime.now().timestamp())
    new_text = {
        'text': request.json.get('text'),
        'label': request.json.get('label',''),
        'author': ObjectId(_id),
        'date_created': timestamp,
        'date_modified': timestamp
    }

    # save text object
    new_text_obj = mongo.db.texts.insert_one(new_text)
    _text_id = new_text_obj.inserted_id

    return jsonify({
        'message': 'text saved', 
        'data': {
            '_id': str(_text_id),
            'text': new_text['text'],
            'label': new_text['label'],
            'date_modified': __convert_datetime(timestamp)
        },
        'success': True
    }), res_code['SUCCESS']


@app.route('/api/text/<text_id>', methods=['GET', 'PATCH', 'DELETE'])
@jwt_required
def process_text(text_id):
    
    _id = get_jwt_identity()
    # verify author and post
    obj = mongo.db.texts.find_one({'_id': ObjectId(text_id), 'author': ObjectId(_id)}) 
    if not obj:
        return jsonify({'message': 'invalid update', 'success': False}), res_code['UNAUTH']

    # get text info
    if request.method == 'GET':

        return jsonify({
            'message': 'got text info',
            'data': {
                '_id': str(obj.get('_id')),
                'text': obj.get('text'),
                'label': obj.get('label'),
                'date_modified': obj.get('date_modified')
            },
            'success': True
        }), res_code['SUCCESS']

    # partial update
    if request.method == 'PATCH':
        
        return jsonify({
            'message': 'text edited',
            'success': True
        }), res_code['SUCCESS']
    
    # delete text
    if request.method == 'DELETE':

        removed_obj = mongo.db.texts.delete_one({'_id': obj.get('_id'), 'author': obj.get('author')})
        print(removed_obj.deleted_count)
        return jsonify({
            'message': 'text deleted',
            'data': {
                '_id': str(obj.get('_id')),
                'text': obj.get('text')
            },
            'success': True
        }), res_code['SUCCESS']



