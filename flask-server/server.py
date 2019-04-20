from flask import jsonify, request, redirect, url_for, make_response
from flask_app import app, mongo, bcrypt, jwt
import flask_app.var_func as vf
import sys, os, re
import pickle, datetime, time
import requests


### ===== CONFIG ===== ###

sys.path.append('data_model')

PORT = os.environ.get('PORT','8088')


### ===== ROUTES ===== ###

@app.errorhandler(vf.res_code['NOTFOUND'])
def not_found(error):
    return make_response(jsonify({
        'error': "route \'"+request.path+"\' is not found",
        'success': False
    }), vf.res_code['NOTFOUND'])


@app.route('/')
def index():
    return make_response(jsonify({
        'message': 'welcome to Flask App',
        'success': True
    }), vf.res_code['SUCCESS'])


@app.route('/index')
@app.route('/home')
def to_index(): 
    return redirect(url_for('index'))


@app.route('/api')
def api_index():
    return make_response(jsonify({
        'message': 'API index',
        'success': True
    }), vf.res_code['SUCCESS'])
    

### ===== MAIN ===== ###

if __name__ == '__main__':
    app.config['DEBUG'] = os.environ.get('ENV','development') == 'development'
    app.run(host='0.0.0.0', port=int(PORT))
