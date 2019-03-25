
import datetime, time

### ===== CONSTANTS ===== ###

res_code = {
    'SUCCESS': 200,
    'BAD_REQ': 400,
    'UNAUTH': 401,
    'NOTFOUND': 404,
    'INTERNAL_ERR': 500
}


### ===== FUNCTIONS ===== ###

## get timestamp
def get_timestamp():
    return datetime.datetime.now().timestamp()


## convert epoch to datetime string
def convert_datetime(time_str,time_required=True):
    if time_required:
        return time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(float(time_str)))
    return time.strftime('%Y-%m-%d', time.localtime(float(time_str)))
