from common.utilities import *
from fastapi import APIRouter
import base64
import logging

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
        result["exit_message"] = e.msg
    return result

@router.put('/update')
def update_user_credit(user: str, deposit: str):
    #return {"result": users_information_list, "exit_code": "200|400", "exit_message": ""}

    logging.basicConfig(level=logging.INFO)
    logging.info("[DEBUGGING] user: " + user)
    logging.info("[DEBUGGING] deposit: " + deposit)

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
        result['exit_message'] = e.msg
    return result
