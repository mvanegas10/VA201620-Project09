# import csv
# csvfile = open('/Users/Meili/Documents/VA201620-Project09/data/tickets_elapsed_2016_complete.csv', 'rb')
# spamreader = csv.reader(csvfile, delimiter=',', quotechar=' ')
# import csv
# csvfile = open('/Users/Meili/Documents/VA201620-Project09/data/tickets.csv', 'wb')
# spamwriter = csv.writer(csvfile, delimiter=',', quotechar=' ', quoting=csv.QUOTE_MINIMAL)

# # i = 0
# for row in spamreader:
# 	write = (','.join(row)).replace('\"', '')
# 	spamwriter.writerow([write])
# 	# i += 1
# 	# if i == 100:
# 	# 	break

import psycopg2
from sets import Set
from datetime import datetime

try:
    conn = psycopg2.connect("dbname='va201620' user='Meili' host='localhost' password=''")
except:
    print "I am unable to connect to the database"

daysDuration = {}
cur = conn.cursor()
cur.execute("SELECT date(time_finish_current),duration from tickets")
rows = cur.fetchall()
cur.close()
for row in rows:
	try: daysDuration[row[0]] += row[1]
	except: daysDuration[row[0]] = row[1]
# print daysDuration	

for key in daysDuration:
	cur = conn.cursor()
	sql = "UPDATE days SET duration = %d , weekday = %d WHERE day = '%s'" % (daysDuration[key],key.weekday(),key.strftime("%Y-%m-%d"))
	print sql
	cur.execute(sql)
	cur.close()

# for day in days_set:
# 	cur1 = conn.cursor()
# 	day = day.strftime("%Y-%m-%d")
# 	sql = "INSERT INTO days (day,duration) VALUES ('%s', 0);" % (day)
# 	print sql
# 	# print day.strftime("%Y-%m-%d")
# 	cur1.execute(sql)
# 	cur1.close()

conn.commit()


# cur = conn.cursor()
# cur.execute("SELECT * from tickets")
# rows = cur.fetchall()
# cur.close()