from fastapi import APIRouter
from common.utilities import *
import base64
import copy
import logging

router = APIRouter(
    prefix='/api/render-home'
)

@router.get('/ongoing-bid-items')
def get_ongoing_bid_items():
    #return {'result': ongoing_bid_list, 'exit_code': '200|400', 'exit_message': ''}

    result = {"result": {}, "exit_code": "200", "exit_message": "Success"}
    utilities = Utilities()

    try:
        utilities.update_ongoing_completed_bid_json()
    except UtilitiesException as e:
        result["exit_code"] = "400"
        result["exit_message"] = e.msg
        return result

    try:
        ongoing_bid_dict = utilities.get_ongoing_bid()
        ongoing_bid_list = ongoing_bid_dict['ongoing']
        result["result"] = ongoing_bid_list
    except UtilitiesException as e:
        result["exit_code"] = "400"
        result["exit_message"] = e.msg

    return result

@router.get('/completed-bid-items')
def get_completed_bid_items():
    result = {"result": {}, "exit_code": "200", "exit_message": "Success"}
    utilities = Utilities()

    try:
        utilities.update_ongoing_completed_bid_json()
    except UtilitiesException as e:
        result["exit_code"] = "400"
        result["exit_message"] = e.msg
        return result
    
    try:
        completed_bid_dict = utilities.get_completed_bid()
        completed_bid_list = completed_bid_dict['completed']
        result["result"] = completed_bid_list
    except UtilitiesException as e:
        result["exit_code"] = "400"
        result["exit_message"] = e.msg

    return result

@router.get("/get_users")
def get_users():
    #return {"result": users_information_list, "exit_code": "200|400", "exit_message": ""}

    result = {"result": {}, "exit_code": "200", "exit_message": "Success"}
    try:
        utilities = Utilities()
        users_information_dict = utilities.get_users_information()
        users_information_list = users_information_dict['users_information']
        result["result"] = users_information_list
    except UtilitiesException as e:
        result["exit_code"] = "400"
        result["exit_message"] = e.msg
    return result

@router.get('/bid-item')
def bid_item(email: str, item_id: str, bid_price: str):
    #return {'result': ongoing_bid_list, 'exit_code': '200|400', 'exit_message': ''}

    logging.basicConfig(level=logging.INFO)
    logging.info("[DEBUGGING] email: " + email)
    logging.info("[DEBUGGING] item_id: " + item_id)
    logging.info("[DEBUGGING] bid_price: " + bid_price)

    result = {"exit_code": "200", "exit_message": "Success"}
    utilities = Utilities()

    try:
        utilities.update_ongoing_completed_bid_json()
    except UtilitiesException as e:
        result["exit_code"] = "400"
        result["exit_message"] = e.msg

    try:      
        logging.info("[DEBUGGING] Start of Bid Item" + bid_price)
        #(2) Get ongoing_bid_json (FOR CHECKING)
        ongoing_bid_dict = utilities.get_ongoing_bid()
        ongoing_bid_list = ongoing_bid_dict['ongoing']

        logging.info("DEBUGGING: ongoing_bid_dict: " + str(ongoing_bid_dict))
        logging.info("DEBUGGING: ongoing_bid_list: " + str(ongoing_bid_list))

        #(3) Get users_information_json
        users_information_dict = utilities.get_users_information()
        users_information_list = users_information_dict['users_information']
    except UtilitiesException as e:
        result["exit_code"] = "400"
        result["exit_message"] = e.msg
    
    try:
        found_flag = False
        found_item = {}
        temp_ongoing_bid_list = []

        logging.info("DEBUGGING: CHECKPOINT 1")
        logging.info("DEBUGGING: ongoing_bid_list: " + str(ongoing_bid_list))
        logging.info("DEBUGGING: item_id " + str(item_id))

        for item in ongoing_bid_list:
            logging.info("DEBUGGING: item[id]: " + str(item['id']))
            logging.info("DEBUGGING: type of item[id]: " + str(type(item['id'])))

            if item['id'] != item_id:
                continue
            else:
                found_flag = True
                found_item = item
                break

        logging.info("DEBUGGING: CHECKPOINT 2")
        logging.info("DEBUGGING: found_flag: " + str(found_flag))

        if found_flag == False:
            result["exit_code"] = "400"
            result["exit_message"] = "Time has elapsed for bidding in the selected item. No more bid allowed for selected item."
            return result
        else:
            logging.info("DEBUGGING: CHECKPOINT 3")

            #(4) Check if the bid_price > current_price of item
            if int(bid_price) <= int(found_item['current_price']):
                result["exit_code"] = "400"
                result["exit_message"] = "Bid price SHOULD be bigger than Current Price."
                return result
            else:
                logging.info("DEBUGGING: CHECKPOINT 4")

                logging.info("DEBUGGING: bid_price > current_price: %s" % temp_ongoing_bid_list)

                found_flag = False
                found_user_ongoing_bid = []
                found_user = {}
                for user in users_information_list:
                    if user['email'] != email:
                        continue
                    else:
                        found_flag = True
                        found_user_ongoing_bid = user['ongoing_bid']
                        found_user = user
                        break

                temp_ongoing_bid_list = copy.deepcopy(found_user_ongoing_bid)
                logging.info("DEBUGGING: temp_ongoing_bid_list: %s" % temp_ongoing_bid_list)

                found_flag = False
                for item in temp_ongoing_bid_list:
                    if item['id'] != item_id:
                        continue
                    else:
                        found_flag = True
                        item['bid_price'] = bid_price
                        break

                if found_flag == False:
                    temp_ongoing_bid_list.append({'id': item_id, 'bid_price': bid_price})

                logging.info("DEBUGGING: temp_ongoing_bid_list: %s" % temp_ongoing_bid_list)

                total_bid_price = 0
                for item in temp_ongoing_bid_list:
                    total_bid_price = total_bid_price + int(item['bid_price'])

                #(5) If sum <= email's credit
                logging.info("DEBUGGING: found_user: %s" % found_user)

                if total_bid_price > int(found_user['credit']):
                    result["exit_code"] = "400"
                    result["exit_message"] = "Your credit should be bigger than selected item's Current Price. Deposit and bid again."
                    return result
                else:
                    logging.info("DEBUGGING: temp_ongoing_bid_list: %s" % temp_ongoing_bid_list)

                    #(6) Get the old bidders' email and item's id and remove item in ongoing_bid of old email
                    if (len(found_item['bidders']) != 0):
                        old_bidder_email = found_item['bidders'][0]['email']

                        old_bidder_ongoing_bid_list = []
                        for user in users_information_list:
                            if user['email'] != old_bidder_email:
                                continue
                            else:
                                old_bidder_ongoing_bid_list = user['ongoing_bid']
                                break

                        found_idx = None
                        for idx, item in enumerate(old_bidder_ongoing_bid_list):
                            if item['id'] != item_id:
                                continue
                            else:
                                found_idx = idx
                                break
                        old_bidder_ongoing_bid_list.pop(found_idx)

                    #(7) Set the users_information_list ongoing_bid = temp_ongoing_bid
                    found_idx = None
                    for idx, user in enumerate(users_information_list):
                        if user['email'] != email:
                            continue
                        else:
                            found_idx = idx
                            break

                    logging.info("DEBUGGING: temp_ongoing_bid_list: %s" % temp_ongoing_bid_list)

                    users_information_list[found_idx]['ongoing_bid'] = temp_ongoing_bid_list

                    logging.info("DEBUGGING: users_information_list: %s" % users_information_list)

                    #(7) Set the ongoing_bid_list current_price and bidders
                    found_idx = None
                    for idx, item in enumerate(ongoing_bid_list):
                        if item['id'] != item_id:
                            continue
                        else:
                            found_idx = idx
                            break

                    new_bidders_dict = {'email': email, 'bid_price': bid_price}
                    ongoing_bid_list[found_idx]['current_price'] = bid_price
                    ongoing_bid_list[found_idx]['bidders'] = [new_bidders_dict]

                    #(8) Create bid JSON file
                    # create_users_information_json()
                    utilities.create_users_information_json(users_information_dict)

                    # create_ongoing_bid_json()
                    utilities.create_ongoing_bid_json(ongoing_bid_dict)

    except UtilitiesException as e:
        result["exit_code"] = "400"
        result["exit_message"] = e.msg
    return result
