from pymongo import MongoClient
import json

PUZZLES_FILE = "../data/puzzles.json"
MONGODB_CONNECTIONG_STRING = ""

mongo_client = MongoClient(MONGODB_CONNECTIONG_STRING, 
                            tls=True,
                            tlsAllowInvalidCertificates=True)
db = mongo_client.main

with open(PUZZLES_FILE) as pfile:
    puzzles = json.loads(pfile.read())


db.puzzles.insert_many(puzzles[:3])