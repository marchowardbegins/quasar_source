# coding=utf-8

"""This module, book_data_logger.py, saves book data and saves it through the C program."""

import requests as r

from datetime import datetime
import calendar

from subprocess import Popen, PIPE

#define BOOK_TYPE_BUY_ORDERS  2
#define BOOK_TYPE_SELL_ORDERS 3

ORDER_TYPE_SELL = 'SellOrders'
ORDER_TYPE_BUY  = 'BuyOrders'

KEY_AMOUNT      = 'Amount'
KEY_PRICE       = 'Price'
KEY_INDEX       = 'Index'


class BookOrders(object):
	"""Utility objects to parse data raw data into C data."""

	def __init__(self, order_type, data):
		self.order_type = order_type
		if self.order_type == ORDER_TYPE_BUY:
			self.order_type_number = 2
		else:
			self.order_type_number = 3
		self.number_of_rows = len(data)

		d = datetime.now()
		unixtime = calendar.timegm(d.utctimetuple())

		p = Popen('./a.out ' + str(unixtime) + ' ' + str(self.order_type_number) + ' ' + str(self.number_of_rows), shell=True, stdin=PIPE)

		for row in data:
			amount = row[KEY_AMOUNT]
			price = int(('{:.8f}'.format(row[KEY_PRICE])).replace('0.', ''))

			p.stdin.write(bytes('%f\n' % amount, 'utf-8'))
		p.stdin.close()
		p.wait()

		#c_process = Popen('a.out', stdin=PIPE, stdout=PIPE)
		#out, err = c_process.communicate()


result = r.get('https://www.southxchange.com/api/book/MSR/BTC')

if result.status_code == 200:
	data = eval(result.content.decode("utf-8"))

	buy_orders  = BookOrders(ORDER_TYPE_BUY,  data[ORDER_TYPE_BUY])
	#sell_orders = BookOrders(ORDER_TYPE_SELL, data[ORDER_TYPE_SELL])


else:
	print('TODO : Log an error!')

