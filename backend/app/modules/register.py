from fastapi import APIRouter
from common.utilities import *

import base64

router = APIRouter(
    prefix='/api/register'
)

@router.put('/')
def register_user(user='bHVjaWEuZGltYWN1bGFuZ2FuQGdtYWlsLmNvbTpwYXNzMTIzNA=='):
    utilities = Utilities()
    user_dict = {'email': '', 'password': '', 'credit': '0', 'ongoing_bid': [], 'completed_bid': []}
    result = {'exit_code': '200', 'exit_message': 'Success'}
    try:
        users_information_dict = utilities.get_users_information()
        users_information_list = users_information_dict['users_information']
        user_dict['email'] = base64.b64decode(user).decode('ascii').split(':')[0]
        encrypted_pass = (base64.b64decode(user).decode('ascii').split(':')[1]).encode("ascii")
        user_dict['password'] = base64.b64encode(encrypted_pass)
        users_information_list.append(user_dict)

        utilities.create_users_information_json(users_information_dict)
    except UtilitiesException as e:
        result['exit_code'] = '400'
        result['exit_message'] = e
    return result

@router.get("/get-users")
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
