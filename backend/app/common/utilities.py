import configparser
import json
import logging
import simplejson
from datetime import date, datetime, timedelta

class Utilities:
    def __init__(self):

        logging.basicConfig(level=logging.INFO)

        #Read config.ini file
        self._FILEPATH_SECTION = 'filepath'
        self._CONFIG_FILEPATH = r'C:\Users\roan.j.dimaculangan\Projects\ONLINE-AUCTION-SYSTEM\backend\app\conf\config.ini'
        try:
            self._CONFIG = configparser.ConfigParser()
            self._CONFIG.read(self._CONFIG_FILEPATH)
            self._USERS_JSON_FILEPATH = self._CONFIG.get(self._FILEPATH_SECTION, 'users_json_filepath')
            self._ONGOING_BID_JSON_FILEPATH = self._CONFIG.get(self._FILEPATH_SECTION, 'ongoing_bid_json_filepath')
            self._COMPLETED_BID_JSON_FILEPATH = self._CONFIG.get(self._FILEPATH_SECTION, 'completed_bid_json_filepath')
        except Exception as e:
            raise UtilitiesException("Error encountered while reading the config.ini file.")

    def get_users_information(self):
        # Opening JSON file
        try:
            f = open(self._USERS_JSON_FILEPATH)
            data = json.load(f)
            f.close()
            return data
        except Exception as e:
            raise UtilitiesException("Error encountered while reading the User's JSON file.")

    def create_users_information_json(self, users_dict):
        try:
            with open(self._USERS_JSON_FILEPATH, 'w') as json_file:
                json_file.write(simplejson.dumps(users_dict, indent=4))
                json_file.close()
        except Exception as e:
            raise UtilitiesException("Error encountered while writing to User's JSON file.")

    def get_ongoing_bid(self):
        # Opening JSON file
        try:
            f = open(self._ONGOING_BID_JSON_FILEPATH)
            data = json.load(f)
            f.close()
            return data
        except Exception as e:
            raise UtilitiesException("Error encountered while reading the Ongoing Bid JSON file.")

    def get_completed_bid(self):
        # Opening JSON file
        try:
            f = open(self._COMPLETED_BID_JSON_FILEPATH)
            data = json.load(f)
            f.close()
            return data
        except Exception as e:
            raise UtilitiesException("Error encountered while reading the Completed Bid JSON file.")

    def create_ongoing_bid_json(self, ongoing_bid_dict):
        try:
            with open(self._ONGOING_BID_JSON_FILEPATH, 'w') as json_file:
                json_file.write(simplejson.dumps(ongoing_bid_dict, indent=4))
                json_file.close()
        except Exception as e:
            raise UtilitiesException("Error encountered while writing to Ongoing Bid's JSON file.")

    def create_completed_bid_json(self, completed_bid_dict):
        try:
            with open(self._COMPLETED_BID_JSON_FILEPATH, 'w') as json_file:
                json_file.write(simplejson.dumps(completed_bid_dict, indent=4))
                json_file.close()
        except Exception as e:
            raise UtilitiesException("Error encountered while writing to Completed Bid's JSON file.")

    def update_ongoing_completed_bid_json(self):

        logging.info("DEBUGGING: HERE")

        try:
            ongoing_bid_dict = self.get_ongoing_bid()
            ongoing_bid_list = ongoing_bid_dict['ongoing']

            completed_bid_dict = self.get_completed_bid()
            completed_bid_list = completed_bid_dict['completed']
            
            stage_bid_list = []
            new_ongoing_bid_list = []
            # Get current date
            # Get current time
            # Get start date and start time
            current_date = date.today().strftime('%Y-%m-%d')
            current_time = datetime.now().strftime('%H:%M:%S')

            logging.info("DEBUGGING: TYPEOF current_date: %s" % type(current_date))
            logging.info("DEBUGGING: current_date: %s" % current_date)

            #(1) Iterate through each item in ongoing_bid_json
            logging.info("DEBUGGING: ongoing_bid_list: %s" % ongoing_bid_list)

            for item in ongoing_bid_list:
                if current_date <= item['end_date']:
                    if current_time >= item['end_time']:
                        # add the item under stage_bid_dict
                        stage_bid_list.append(item)

                    elif current_time < item['end_time']:
                        # add the item under new_ongoing_bid_list
                        new_ongoing_bid_list.append(item)

                elif current_date > item['end_date']:
                    # add the item under stage_bid_list
                    stage_bid_list.append(item)

            logging.info("DEBUGGING: STAGE BID LIST: %s" % stage_bid_list)

            #(2) Perform debit on highest bidder
            users_information_dict = self.get_users_information()
            users_information_list = users_information_dict['users_information']

            for item in stage_bid_list:
                if len(item['bidders']) == 0:
                    continue
                else:
                    # Get the last bidder in the item
                    bidders = item['bidders']
                    last_bid_email = bidders[len(bidders) - 1]['email']
                    last_bid_price = bidders[len(bidders) - 1]['bid_price']

                    # Update the users_information_list
                    for user in users_information_list:
                        if user['email'] != last_bid_email:
                            continue
                        else:
                            #Update credit
                            user['credit'] = str(int(user['credit']) - int(last_bid_price))

                            #Update completed_bid
                            new_completed_bid = {'id': item['id'], 'bid_price': str(last_bid_price)}
                            user['completed_bid'].append(new_completed_bid)

                            #Update ongoing_bid
                            fin_idx = None
                            for idx, bid in enumerate(user['ongoing_bid']):
                                if bid['id'] != item['id']:
                                    continue
                                else:
                                    fin_idx = idx
                                    break

                            user['ongoing_bid'].pop(fin_idx)

            # Add the item in completed_bid_dict
            new_completed_bid_list = completed_bid_list + stage_bid_list

            #(3) Create bid JSON file
            # create_ongoing_bid_json()
            new_ongoing_bid_dict = {'ongoing': new_ongoing_bid_list}
            self.create_ongoing_bid_json(new_ongoing_bid_dict)

            # create_completed_bid_json()
            new_completed_bid_dict = {'completed': new_completed_bid_list}
            self.create_completed_bid_json(new_completed_bid_dict)

            # create_users_information_json()
            self.create_users_information_json(users_information_dict)        
            ##END

        except Exception as e:
            raise UtilitiesException("Error encountered during updating of Ongoing and Completed Bid JSON files.")
class UtilitiesException(Exception):
    def __init__(self, msg):
        self.msg = msg

    def __repr__(self):
        return self.msg
