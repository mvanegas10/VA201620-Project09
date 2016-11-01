import psycopg2
import csv
import codecs
from unidecode import unidecode

conn = psycopg2.connect("dbname=va201620 user=Meili")

csvfile = open('/Users/Meili/Documents/VA201620-Project09/data/doc.csv', 'rb')
spamreader = csv.reader(csvfile, delimiter=',', quotechar=' ')
for row in spamreader:
	if not (row[0] == 'index'):
		del row[11]
		query = 'INSERT INTO tickets (index,id, name, history_type_id, ticket_id,article_id, type_id, queue_id, owner_id, priority_id, state_id,create_time, create_by, change_time, change_by, name_1, comments, type_id_1,tn, title, service_id, sla_id, ticket_state_id, customer_id, customer_user_id,timeout, alarm_code, device_id) VALUES ('
		try:
			for i in range(0,len(row)):
				if i == 0:
					query += row[i]
				else:
					if not row[i] == '\N':
						try:				
							row[i] = round(float(row[i]),0)
							query += ",%f" % (row[i])
						except:
							query += ",'%s'" % unidecode(row[i])
					else:
						query += ",NULL"
			query += ")"
			cur = conn.cursor()		
			cur.execute(query)
			print row[0]
			cur.close()
			conn.commit()

		except:
			"Falla %s" % (row[i])