#!/bin/python3

import json
import schedule
import time
import random

def job():
  try:
    nb_data = {}
    nb = random.randint(1000, 3000)
    nb_data['nb'] = nb

    with open('randomNb.json', 'w', encoding='utf-8') as final_nb:
      json.dump(nb_data, final_nb, ensure_ascii=False, indent=2)
  except:
    pass
    
schedule.every(1).seconds.do(job)

while True:
  schedule.run_pending()
  time.sleep(15)