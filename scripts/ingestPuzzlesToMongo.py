from pymongo import MongoClient
import json
import glob
import random

PUZZLES_DIR = "../data/puzzles"
MONGODB_CONNECTION_STRING = ""
OUT_FILE = f"{PUZZLES_DIR}/puzzles.json"


mongo_client = MongoClient(MONGODB_CONNECTION_STRING, 
                            tls=True,
                            tlsAllowInvalidCertificates=True)
db = mongo_client.main

puzzles = []
puzzle_files = glob.glob(PUZZLES_DIR + "/*")
print(puzzle_files)
for puzzle_filename in puzzle_files:
    with open(puzzle_filename) as pfile:
        puzzles.extend(json.loads(pfile.read()))

random.shuffle(puzzles)

for puzzle_number, puzzle in enumerate(puzzles):
    puzzle["puzzle_number"] = puzzle_number + 1


print(len(puzzles))

with open(OUT_FILE, 'w') as outfile:
    outfile.write(json.dumps(puzzles))
#db.puzzles.delete_many({})
#db.puzzles.insert_many(puzzles[:20])
