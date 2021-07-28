import re
import datetime
import sys

file_num = 1
line_count = 0
max_amount = 2000
count = 0

if len(sys.argv) != 2:
    print('filename argument required')
else:
    csv_filename = sys.argv[1]
    prefix = csv_filename.split('.')[0] + '_'
    sql_filename = prefix + 'rows' + str(file_num) + '.sql'

    sql_file = open(sql_filename, 'w')
    sql_file.write('INSERT INTO fixture (competition, round, home_team, away_team, date, time, venue)  VALUES (')

    with open(csv_filename, encoding='utf-8-sig') as csv_file:
        first = True
        for line in csv_file:
            count += 1
            words = line.split(',')

            # remove ' - 2018' from comp name
            words[0] = words[0].replace(' - 2018', '')

            # Get round in proper format
            try:
                lRound = int(words[1])
            except:
                match = re.search('[0-9]+', words[1])
                if match:
                    lRound = match.group(0)
            
            words[1] = str(lRound)
            
            # Get date in proper format
            dateTime = datetime.datetime.strptime(words[5], '%d-%b-%y')
            date = str(dateTime.year) + '-' + str(dateTime.month) + '-' + str(dateTime.day)
            words[5] = date
            
            # Get time in proper format
            times = words[6].split(':')
            time = times[0] + ':' + times[1]
            words[6] = time
            
            # Remove 'vs' column
            try:
                words.remove('vs')
            except:
                pass

            try:
                words.remove('Vs')
            except:
                pass
            
            s = '", "'
            insert = ('"' if first else ', ("') + s.join(words).strip('\n\r') + '")'
            
            sql_file.write(insert)
            if first:
                first = False
            
            line_count += 1
            if line_count >= max_amount:
                # new sql file - reached row limit
                line_count = 0
                file_num += 1
                sql_file.close()
                first = True
                sql_filename = prefix + 'rows' + str(file_num) + '.sql'
                sql_file = open(sql_filename, 'w')
                sql_file.write('INSERT INTO fixture (competition, round, home_team, away_team, date, time, venue)  VALUES (')

    sql_file.close()
    print(str(count) + " fixtures.")