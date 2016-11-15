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

try:
    conn = psycopg2.connect("dbname='va201620' user='Meili' host='localhost' password=''")
except:
    print "I am unable to connect to the database"

days = []
cur = conn.cursor()
cur.execute("SELECT * from tickets")
rows = cur.fetchall()
cur.close()
for i,row in enumerate(rows):
	cur1 = conn.cursor()
	sql = "SELECT date(time_finish_current) FROM tickets WHERE id = %d" % (row[11])	
	cur1.execute(sql)
	rows = cur1.fetchall()
	day = rows[0][0]
	days.append(day)
	cur1.close()

days_set = Set(days)
print days_set

for day in days_set:
	cur1 = conn.cursor()
	cur1.execute("""INSERT INTO days (day,duration) VALUES (%s, 0);""",(day,))
	cur1.close()


# cur = conn.cursor()
# cur.execute("SELECT * from tickets")
# rows = cur.fetchall()
# cur.close()