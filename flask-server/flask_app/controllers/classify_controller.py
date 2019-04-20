from flask import jsonify, request, make_response
from flask_app import app, mongo, jwt
import flask_app.var_func as vf
import pickle, datetime, time
#import data_model.NaiveBayesTextClassifier as nb


@app.route('/api/classify', methods=['POST', 'GET'])
def nb_classifier():
    if request.method in ['POST', 'GET']: 
        
        # open model
        model = None
        with open('data_model/nb_model.pickle','rb') as f: 
            model = pickle.load(f)
        
        if not model: 
            return jsonify({'message': 'server error', 'success': False}), vf.res_code['INTERNAL_ERR']

        if not request.json: 
            return jsonify({'message': 'text is empty', 'success': False}), vf.res_code['BAD_REQ']
        
        # clean data
        text = vf.__cleanse_instance(request.json.get('text'))
        
        # do classification
        words = text.split()
        if not words: 
            return jsonify({'message': 'text is empty', 'success': False}), vf.res_code['BAD_REQ']
        result = model.classify(words)
        
        return make_response(jsonify({
            'message': 'got label successfully',
            'data': {'label': result},
            'success': True
        }), vf.res_code['SUCCESS'])
    else:
        return jsonify({'message': '', 'success': False}), vf.res_code['BAD_REQ']
