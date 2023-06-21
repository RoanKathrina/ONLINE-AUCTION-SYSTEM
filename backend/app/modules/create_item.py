from datetime import date, datetime, timedelta
from fastapi import APIRouter
from common.utilities import *

import base64

router = APIRouter(
    prefix='/api/create-item'
)

@router.get('/')
def create_new_item(item_name='shoes', start_price='1500', time_window='00:10:00'):
    #return {'result': users_information_list, 'exit_code': '200|400', 'exit_message': ''}
    # //http://127.0.0.1:8086/api/create-item/?item_name='clothes'&start_price=1800&time_window=23:10:30
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

    try:
        utilities = Utilities()
        ongoing_bid_dict = utilities.get_ongoing_bid()
        ongoing_bid_list = ongoing_bid_dict['ongoing']
        ongoing_bid_list.append(new_item_dict)
        utilities.create_ongoing_bid_json(ongoing_bid_dict)

    except UtilitiesException as e:
        result["exit_code"] = "400"
        result["exit_message"] = e
    return result
