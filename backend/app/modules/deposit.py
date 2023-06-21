from fastapi import APIRouter
from common.utilities import *

import base64

router = APIRouter(
    prefix='/api/deposit'
)

@router.get('/get_users')
def get_users():
    #return {"result": users_information_list, "exit_code": "200|400", "exit_message": ""}

    utilities = Utilities()
    result = {"result": {}, "exit_code": "200", "exit_message": "Success"}
    try:
        users_information_dict = utilities.get_users_information()
        users_information_list = users_information_dict['users_information']
        result["result"] = users_information_list
    except UtilitiesException as e:
        result["exit_code"] = "400"
        result["exit_message"] = e
    return result

@router.get('/update')
def update_user_credit(user='cm9hbi5kaW1hY3VsYW5nYW5AZ21haWwuY29t', deposit='1300'):
    #return {"result": users_information_list, "exit_code": "200|400", "exit_message": ""}
    #//http://127.0.0.1:8086/api/deposit/update/?user="cm9hbi5kaW1hY3VsYW5nYW5AZ21haWwuY29t"&deposit=1300

    utilities = Utilities()
    result = {'exit_code': '200', 'exit_message': 'Success'}
    try:
        users_information_dict = utilities.get_users_information()
        users_information_list = users_information_dict['users_information']
        email = base64.b64decode(user).decode('ascii').split(':')[0]
        for user in users_information_list:
            if user['email'] != email:
                continue
            else:
                credit = user['credit']
                credit_int = int(credit) + int(deposit)
                user['credit'] = str(credit_int)

        utilities.create_users_information_json(users_information_dict)
    except UtilitiesException as e:
        result['exit_code'] = '400'
        result['exit_message'] = e
    return result
