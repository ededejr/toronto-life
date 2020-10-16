###################################
# 
# This will generate neighborhood objects from our neighborhood census data
#
###################################

import csv
import json
import re

neighborhoods = {}

with open('rawdata/neighborhood-profiles.csv', mode='rU') as f:
  reader = csv.reader(f,delimiter=',')
  rows = enumerate(reader)
  for row in rows:
    if row[0] == 0:
      neighborhoodList = row[1][5:]
      for item in neighborhoodList:
        neighborhoods[neighborhoodList.index(item)] = {
          "name": item,
          "neighborhoodID": None, # City of Toronto issued ID 
          "population": {},
          "income": {
            "individuals": {},
            "households": {}
          },
          "languages": {
            "home": {},
            "native": {},
            "work": {}
          },
          "transit": {
            "travelTimeToWork": {},
            "transitMethod": {}
          },
          "educationLevels": {},
          "visibleMinorities": {},
          "ethnicOrigin": {},
          "immigrants": {}, # This is by place of birth
          "housing": {},
          "employment": {},
          "schools": {
            'secondary': None,
            'elementary': None,
            'university': None
          },
          "placesOfWorship": {
            'buddhist': None,
            'catholic': None,
            'hindu': None,
            'jain': None,
            'jewish': None,
            'muslim': None,
            'orthodox': None,
            'other': None,
            'scientology': None,
            'sikh': None,
            'unitarian': None,
            'zoroastrain': None,
            'bahai': None,
            'christian': None
          },
          "parks": {},
          "policeStations": None,
          "ambulanceStations": None,
          "fireStations": None,
          "bicycleParking": None,
          "retirementHomes": None,
          "youthServices": None,
          "culturalSpaces": None
        }
    
    # Handle stuff that aren't headers
    rowID = row[1][0]
    category = row[1][1]
    hoodRow = row[1][5:]
    descriptor = row[1][4]

    # Handle neighborhoodID
    if (category == 'neighborhood Information'):
      for item in hoodRow:
        if (descriptor == 'neighborhood Number'):
          neighborhoods[hoodRow.index(item)]['neighborhoodID'] = row[1][hoodRow.index(item)+5]
        

    # Handle Population
    if (category == 'Population'):
      for item in hoodRow:
        cityIndexNumber = hoodRow.index(item);
        count = row[1][cityIndexNumber+5].replace(',','')
        neighborhoods[cityIndexNumber]['population'][descriptor.strip()] = count
    
    # Income per household
    # ID numbers 1039-1054
    if ((category == 'Income') and (int(rowID) >= 1039 and int(rowID) <= 1054)):
      for item in hoodRow:
        cityIndexNumber = hoodRow.index(item)
        neighborhoods[cityIndexNumber]['income']['households'][descriptor.strip()] = int(row[1][cityIndexNumber+5].replace(',',''))
    
    # Income per individual
    # ID numbers 1004-1017
    if ((category == 'Income') and (row[1][2] == 'Income of individuals in 2015') and (int(rowID) >= 1004 and int(rowID) <= 1017)):
      for item in hoodRow:
        cityIndexNumber = hoodRow.index(item)
        neighborhoods[cityIndexNumber]['income']['individuals'][descriptor.replace('(including loss)','').strip()] = int(row[1][cityIndexNumber+5].replace(',',''))
    
    # Mother tounge
    if (category == 'Language' and row[1][2] == 'Mother tongue' and not(int(rowID) == 140)):
      for item in hoodRow:
        cityIndexNumber = hoodRow.index(item)
        value = int(row[1][cityIndexNumber+5].replace(',',''))
        if not(value == 0):
          neighborhoods[cityIndexNumber]['languages']['native'][descriptor.strip()] = value

    # Language used at home
    if (category == 'Language' and row[1][2] == 'Language spoken most often at home' and not(int(rowID) == 398)):
      for item in hoodRow:
        cityIndexNumber = hoodRow.index(item)
        value = int(row[1][cityIndexNumber+5].replace(',',''))
        if not(value == 0):
          neighborhoods[cityIndexNumber]['languages']['home'][descriptor.strip()] = value
    
    # Language used at work
    if (category == 'Language of work' and row[1][2] == 'Language used most often at work' and not(int(rowID) == 1987) and not(int(rowID) == 1988)):
      for item in hoodRow:
        cityIndexNumber = hoodRow.index(item)
        value = int(row[1][cityIndexNumber+5].replace(',',''))
        if not(value == 0):
          neighborhoods[cityIndexNumber]['languages']['work'][descriptor.strip()] = value

    
    # Commuting times to work
    if (category == 'Journey to work' and row[1][2] == 'Commuting duration' and (int(rowID) >= 1974 and int(rowID) <= 1978)):
      for item in hoodRow:
        cityIndexNumber = hoodRow.index(item)
        neighborhoods[cityIndexNumber]['transit']['travelTimeToWork'][descriptor.strip()] = int(row[1][cityIndexNumber+5].replace(',',''))

    # Commuting methods
    if (category == 'Journey to work' and row[1][2] == 'Main mode of commuting' and (int(rowID) >= 1967 and int(rowID) <= 1972)):
      for item in hoodRow:
        cityIndexNumber = hoodRow.index(item)
        descriptor = descriptor.strip()
        if (descriptor == 'Car, truck, van - as a driver'):
          descriptor = 'driver'
        elif (descriptor == 'Car, truck, van - as a passenger'):
          descriptor = 'passenger'
        neighborhoods[cityIndexNumber]['transit']['transitMethod'][descriptor] = int(row[1][cityIndexNumber+5].replace(',',''))

    # Level of education
    if (category == 'Education' and row[1][2] == 'Highest certificate, diploma or degree' and not(int(rowID) == 1703) and not(int(rowID) == 1715)):
      for item in hoodRow:
        cityIndexNumber = hoodRow.index(item)
        if (descriptor.replace("'", '').strip() in neighborhoods[cityIndexNumber]['educationLevels']):
          neighborhoods[cityIndexNumber]['educationLevels'][descriptor.replace("'", '').strip()] += int(row[1][cityIndexNumber+5].replace(',',''))
        else: 
          neighborhoods[cityIndexNumber]['educationLevels'][descriptor.replace("'", '').strip()] = int(row[1][cityIndexNumber+5].replace(',',''))

    # Visible Minorities
    if (category == 'Visible minority' and row[1][2] == 'Visible minority population' and not(int(rowID) == 1336)):
      for item in hoodRow:
        cityIndexNumber = hoodRow.index(item)
        neighborhoods[cityIndexNumber]['visibleMinorities'][descriptor.strip()] = int(row[1][cityIndexNumber+5].replace(',',''))

    # Ethnic Origin
    if (category == 'Ethnic origin' and row[1][2] == 'Ethnic origin population' and not(int(rowID) == 1350)):
      for item in hoodRow:
        cityIndexNumber = hoodRow.index(item)
        value = int(row[1][cityIndexNumber+5].replace(',',''))
        if not(value == 0):
          neighborhoods[cityIndexNumber]['ethnicOrigin'][descriptor.strip()] = value
    
    # Immigration
    if (category == 'Immigration and citizenship' and row[1][2] == 'Immigrants by selected place of birth'):
      for item in hoodRow:
        cityIndexNumber = hoodRow.index(item)
        value = int(row[1][cityIndexNumber+5].replace(',',''))
        if not(value == 0):
          if ('Total' in descriptor):
            neighborhoods[cityIndexNumber]['immigrants']['Total'] = value
          else:
            neighborhoods[cityIndexNumber]['immigrants'][descriptor.strip()] = value
    
    # Employment
    if (category == 'Labour' and row[1][2] == 'Labour force status'):
       for item in hoodRow:
        cityIndexNumber = hoodRow.index(item)
        if (descriptor.strip() == 'Employed' or descriptor.strip() == 'Unemployed' or descriptor.strip() == 'In the labour force'):
          value = int(row[1][cityIndexNumber+5].replace(',',''))
          if not(value == 0):
            neighborhoods[cityIndexNumber]['employment'][descriptor.strip()] = value
    
    # Housing
    if (category == 'Housing' and row[1][2] == 'Household characteristics'):
      for item in hoodRow:
        cityIndexNumber = hoodRow.index(item)
        value = int(row[1][cityIndexNumber+5].replace(',',''))
        if not(value == 0):
          if (descriptor.strip() == 'Owner' or descriptor.strip() == 'Renter'):
            neighborhoods[cityIndexNumber]['housing'][descriptor.strip()] = value

# Filp keys
for key in list(neighborhoods):
  newKey = neighborhoods[key]['neighborhoodID']
  if (newKey == ''):
    newKey = str(0)
  else:
    newKey = str(newKey)
  neighborhoods[newKey] = neighborhoods.pop(key)

# Process schools data
with open('rawdata/school_count_by_nbhd.csv', mode='rU') as f:
  reader = csv.reader(f,delimiter=',')
  rows = enumerate(reader)
  for row in rows:
    if (row[1][1] != 'NAME'):
      num = re.search("\d+", row[1][1])
      neighborhoodID = row[1][1][num.start() : num.end()].strip()
      neighborhoods[neighborhoodID]['schools']['secondary'] = int(row[1][2])
      neighborhoods[neighborhoodID]['schools']['elementary'] = int(row[1][3])
      neighborhoods[neighborhoodID]['schools']['university'] = int(row[1][4])

# Process Police Station Count
with open('rawdata/police_facility_count_by_nbhd.csv', mode='rU') as f:
  reader = csv.reader(f,delimiter=',')
  rows = enumerate(reader)
  for row in rows:
    if (row[1][1] != 'NAME'):
      num = re.search("\d+", row[1][1])
      neighborhoodID = row[1][1][num.start() : num.end()].strip()
      neighborhoods[neighborhoodID]['policeStations'] = int(row[1][2])

# Ambulance Stations
with open('rawdata/ambulance_station_count_by_nbhd.csv', mode='rU') as f:
  reader = csv.reader(f,delimiter=',')
  rows = enumerate(reader)
  for row in rows:
    if (row[1][1] != 'NAME'):
      num = re.search("\d+", row[1][1])
      neighborhoodID = row[1][1][num.start() : num.end()].strip()
      neighborhoods[neighborhoodID]['ambulanceStations'] = int(row[1][2])

# Fire Stations
with open('rawdata/fire_station_count_by_nbhd.csv', mode='rU') as f:
  reader = csv.reader(f,delimiter=',')
  rows = enumerate(reader)
  for row in rows:
    if (row[1][1] != 'NAME'):
      num = re.search("\d+", row[1][1])
      neighborhoodID = row[1][1][num.start() : num.end()].strip()
      neighborhoods[neighborhoodID]['fireStations'] = int(row[1][2])

# Bicycle Parking
with open('rawdata/bicycle_parking_count_by_nbhd.csv', mode='rU') as f:
  reader = csv.reader(f,delimiter=',')
  rows = enumerate(reader)
  for row in rows:
    if (row[1][1] != 'NAME'):
      num = re.search("\d+", row[1][1])
      neighborhoodID = row[1][1][num.start() : num.end()].strip()
      neighborhoods[neighborhoodID]['bicycleParking'] = int(row[1][2])

# Retirement Homes
with open('rawdata/Retirement_home_count.csv', mode='rU') as f:
  reader = csv.reader(f,delimiter=',')
  rows = enumerate(reader)
  for row in rows:
    if (row[1][1] != 'NAME'):
      num = re.search("\d+", row[1][1])
      neighborhoodID = row[1][1][num.start() : num.end()].strip()
      neighborhoods[neighborhoodID]['retirementHomes'] = int(row[1][2])

# Youth Services
with open('rawdata/Youth_services_count.csv', mode='rU') as f:
  reader = csv.reader(f,delimiter=',')
  rows = enumerate(reader)
  for row in rows:
    if (row[1][1] != 'NAME'):
      num = re.search("\d+", row[1][1])
      neighborhoodID = row[1][1][num.start() : num.end()].strip()
      neighborhoods[neighborhoodID]['youthServices'] = int(row[1][2])

# Cultural Spaces
with open('rawdata/cultural_space_count.csv', mode='rU') as f:
  reader = csv.reader(f,delimiter=',')
  rows = enumerate(reader)
  for row in rows:
    if (row[1][1] != 'NAME'):
      num = re.search("\d+", row[1][1])
      neighborhoodID = row[1][1][num.start() : num.end()].strip()
      neighborhoods[neighborhoodID]['culturalSpaces'] = int(row[1][2])

# Worship Places
with open('rawdata/classified_worship.csv', mode='rU') as f:
  reader = csv.reader(f,delimiter=',')
  rows = enumerate(reader)
  for row in rows:
    if (row[1][1] != 'NAME'):
      num = re.search("\d+", row[1][1])
      neighborhoodID = row[1][1][num.start() : num.end()].strip()
      neighborhoods[neighborhoodID]['placesOfWorship']['buddhist'] = int(row[1][2])
      neighborhoods[neighborhoodID]['placesOfWorship']['catholic'] = int(row[1][3])
      neighborhoods[neighborhoodID]['placesOfWorship']['hindu'] = int(row[1][4])
      neighborhoods[neighborhoodID]['placesOfWorship']['jain'] = int(row[1][5])
      neighborhoods[neighborhoodID]['placesOfWorship']['jewish'] = int(row[1][6])
      neighborhoods[neighborhoodID]['placesOfWorship']['muslim'] = int(row[1][7])
      neighborhoods[neighborhoodID]['placesOfWorship']['orthodox'] = int(row[1][8])
      neighborhoods[neighborhoodID]['placesOfWorship']['other'] = int(row[1][9])
      neighborhoods[neighborhoodID]['placesOfWorship']['scientology'] = int(row[1][10])
      neighborhoods[neighborhoodID]['placesOfWorship']['sikh'] = int(row[1][11])
      neighborhoods[neighborhoodID]['placesOfWorship']['unitarian'] = int(row[1][12])
      neighborhoods[neighborhoodID]['placesOfWorship']['zoroastrain'] = int(row[1][13])
      neighborhoods[neighborhoodID]['placesOfWorship']['bahai'] = int(row[1][14])
      neighborhoods[neighborhoodID]['placesOfWorship']['christian'] = int(row[1][15])
      

# Parks 
with open('rawdata/park_count_by_nbhd.csv', mode='rU') as f:
  reader = csv.reader(f, delimiter=',')
  rows = enumerate(reader)
  for row in rows:
    if (row[1][1] != 'NAME'):
      num = re.search("\d+", row[1][1])
      neighborhoodID = row[1][1][num.start() : num.end()].strip()
      neighborhoods[neighborhoodID]['parks']['count'] = int(row[1][2])
      neighborhoods[neighborhoodID]['parks']['coverage'] = float(row[1][5])
      neighborhoods[neighborhoodID]['area'] = float(row[1][4])


neighborhoodsJSON = json.dumps(neighborhoods)
print(neighborhoodsJSON)
    
    