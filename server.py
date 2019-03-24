from flask import jsonify, request, redirect, url_for, make_response
from flask_app import app, mongo, bcrypt, jwt
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


### ===== FUNCTIONS===== ###

## clean the text
def __cleanse_instance(s):
    punctuation_list = [ "?", ".", ",", "/", "!" ]
    for punc in punctuation_list: s = s.replace(punc,"")
    return s.lower()


### ===== ROUTES ===== ###

@app.errorhandler(res_code['NOTFOUND'])
def not_found(error):
    return make_response(jsonify({
        'error': "route \'"+request.path+"\' is not found",
        'success': False
    }), res_code['NOTFOUND'])


@app.route('/')
def index():
    return make_response(jsonify({
        'message': 'welcome to Flask App',
        'success': True
    }), res_code['SUCCESS'])


@app.route('/index')
@app.route('/home')
def to_index(): 
    return redirect(url_for('index'))


@app.route('/api')
def api_index():
    return make_response(jsonify({
        'message': 'API index',
        'success': True
    }), res_code['SUCCESS'])


@app.route('/api/classify', methods=['POST', 'GET'])
def api_classify():
    if request.method in ['POST', 'GET']: 
        
        # open model
        model = None
        with open('data/nb_model.pickle','rb') as f: model = pickle.load(f)
        if not model: return jsonify({'message': 'server error', 'success': False}), res_code['INTERNAL_ERR']

        if not request.json: 
            return jsonify({'message': 'text is empty', 'success': False}), res_code['BAD_REQ']
        
        # clean data
        text = __cleanse_instance(request.json.get('text'))
        
        # do classification
        words = text.split()
        if not words: 
            return jsonify({'message': 'text is empty', 'success': False}), res_code['BAD_REQ']
        result = model.classify(words)
        
        return make_response(jsonify({
            'message': 'got label successfully',
            'data': {'label': result},
            'success': True
        }), res_code['SUCCESS'])
    else:
        return jsonify({'message': '', 'success': False}), res_code['BAD_REQ']



### ===== MAIN ===== ###

if __name__ == '__main__':
    app.config['DEBUG'] = os.environ.get('ENV','development') == 'development'
    app.run(host='0.0.0.0', port=int(PORT))
