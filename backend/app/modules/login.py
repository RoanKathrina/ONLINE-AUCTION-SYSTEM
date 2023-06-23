from common.utilities import *
from fastapi import APIRouter

router = APIRouter(
    prefix="/api/login"
)

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
        result["exit_message"] = e.msg
    return result
