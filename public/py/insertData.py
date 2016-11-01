import psycopg2
import csv
import codecs
from unidecode import unidecode
types = ["INTEGER"
	,"INTEGER"
	,"VARCHAR(78)"
	,"INTEGER"
	,"INTEGER"
	,"VARCHAR(20)"
	,"INTEGER"
	,"INTEGER" 
	,"INTEGER" 
	,"INTEGER" 
	,"INTEGER"
	,"VARCHAR(19)"
	,"INTEGER"
	,"VARCHAR(19)"
	,"INTEGER"
	,"VARCHAR(78)"
	,"VARCHAR(46)"
	,"INTEGER"
	,"INTEGER" 
	,"VARCHAR(48)"
	,"INTEGER"
	,"VARCHAR(4)"
	,"INTEGER"
	,"VARCHAR(39)"
	,"VARCHAR(14)"
	,"INTEGER"
	,"VARCHAR(4)"
	,"VARCHAR(8)"]

csvfile = open('/Users/Meili/Documents/VA201620-Project09/data/doc.csv', 'rb')
spamreader = csv.reader(csvfile, delimiter=',', quotechar=' ')
for row in spamreader:
	if not (row[0] == 'index'):
		del row[11]
		query = 'INSERT INTO tickets (index,id, name, history_type_id, ticket_id,article_id, type_id, queue_id, owner_id, priority_id, state_id,create_time, create_by, change_time, change_by, name_1, comments, type_id_1,tn, title, service_id, sla_id, ticket_state_id, customer_id, customer_user_id,timeout, alarm_code, device_id) VALUES ('
		try:
			if len(row) == 28:
				conn = psycopg2.connect("dbname=va201620 user=Meili")
				for i in range(0,len(row)):
					if i == 0:
						query += row[i]
					else:
						if not row[i] == '\N':
							if types[i] == "INTEGER":		
								try:				
									row[i] = round(float(row[i]),0)
									query += ",%f" % (row[i])
								except:
									query += ",NULL"
							else:	
								try:
									row[i] = unidecode(row[i])
									query += ",'%s'" % row[i]
								except:
									query += ",''"

						else:
							query += ",NULL"
				query += ")"
				cur = conn.cursor()		
				cur.execute(query)
				print row[0]
				cur.close()
				conn.commit()
				conn.close()
			else:
				print "Falla, tiene %d columnas" % (len(row))
		except:
			"Falla %s" % (row[i])