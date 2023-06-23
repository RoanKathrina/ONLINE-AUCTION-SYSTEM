from common.utilities import *
from datetime import date, datetime, timedelta
from fastapi import APIRouter
import base64
import logging

router = APIRouter(
    prefix='/api/create-item'
)

@router.put('/item')
def create_new_item(item_name: str, start_price: str, time_window: str):
    # return {'result': users_information_list, 'exit_code': '200|400', 'exit_message': ''}
    logging.basicConfig(level=logging.INFO)

    logging.info("[DEBUGGING] item_name: " + item_name)
    logging.info("[DEBUGGING] start_price: " + start_price)
    logging.info("[DEBUGGING] time_window: " + time_window)

    new_item_dict = {
        'id': '',
        'item_name': '',
        'start_price': '',
        'current_price': '',
        'time_window': '00:00:00',
        'start_date': '0',
        'end_date': '0',
        'start_time': '00:00:00',
        'end_time': '00:00:00',
        'bidders': []
    }
    result = {'exit_code': '200', 'exit_message': 'Success'}
    logging.info("[DEBUGGING] create_new_item")

    #Get start date and start time
    start_date = date.today().strftime('%Y-%m-%d')
    start_time = datetime.now().strftime('%H:%M:%S')
    start_schedule = '%s %s' % (start_date, start_time)
    id_val = start_schedule.replace(':', '').replace('-', '').replace(' ', '')

    #dt - str format
    dt = datetime.strptime(start_schedule, '%Y-%m-%d %H:%M:%S')

    #Get end date and end time
    #end_schedule - datetime.datetime format
    end_schedule = dt + timedelta(hours=int(time_window.split(':')[0]), minutes=int(time_window.split(':')[1]), seconds=int(time_window.split(':')[2]))
    end_date = str(end_schedule.strftime('%Y-%m-%d %H:%M:%S')).split(' ')[0]
    end_time = str(end_schedule.strftime('%Y-%m-%d %H:%M:%S')).split(' ')[1]

    #Set the new_item_dict values
    new_item_dict['id'] = id_val
    new_item_dict['item_name'] = item_name
    new_item_dict['item_name'] = item_name
    new_item_dict['start_price'] = start_price
    new_item_dict['current_price'] = start_price
    new_item_dict['time_window'] = time_window
    new_item_dict['start_date'] = start_date
    new_item_dict['end_date'] = end_date
    new_item_dict['start_time'] = start_time
    new_item_dict['end_time'] = end_time

    logging.info("[DEBUGGING] new_item_dict: " + str(new_item_dict))

    try:
        utilities = Utilities()
        ongoing_bid_dict = utilities.get_ongoing_bid()
        ongoing_bid_list = ongoing_bid_dict['ongoing']
        ongoing_bid_list.append(new_item_dict)
        utilities.create_ongoing_bid_json(ongoing_bid_dict)

    except UtilitiesException as e:
        result["exit_code"] = "400"
        result["exit_message"] = e.msg
    return result
