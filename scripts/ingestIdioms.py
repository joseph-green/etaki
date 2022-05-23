import json
from re import S 

FORMAL_IDIOMS_FILE = "../data/formal_idioms_completed.txt"
STATIC_IDIOMS_FILE = "../data/static_idioms.txt"
OUT_FILE = "../data/idiom_puzzles.json"


idioms = []

# for static idioms, add them straight to the puzzle bank
with open(STATIC_IDIOMS_FILE) as static_idioms_file: 
    static_idioms = static_idioms_file.readlines()
    for idm in static_idioms:
        idm = idm.strip()
        idioms.append({"etaki": idm, "katieEtaki": idm})

with open(FORMAL_IDIOMS_FILE) as formal_idioms_file: 
    formal_idioms = formal_idioms_file.readlines()
    for idm in formal_idioms:
        idm = idm.strip()
        idioms.append({"etaki": idm, "katieEtaki": idm})

with open(OUT_FILE, 'w') as out_file:
    out_file.write(json.dumps(idioms))
    