import csv
csvfile = open('/Users/Meili/Documents/VA201620-Project09/data/tickets_elapsed_2016_complete.csv', 'rb')
spamreader = csv.reader(csvfile, delimiter=',', quotechar=' ')
import csv
csvfile = open('/Users/Meili/Documents/VA201620-Project09/data/tickets.csv', 'wb')
spamwriter = csv.writer(csvfile, delimiter=',', quotechar=' ', quoting=csv.QUOTE_MINIMAL)

# i = 0
for row in spamreader:
	write = (','.join(row)).replace('\"', '')
	spamwriter.writerow([write])
	# i += 1
	# if i == 100:
	# 	break
