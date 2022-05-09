import json
from pymongo import MongoClient

QUOTES_FILE = '../data/quotes.json'
PUZZLES_FILE = '../data/puzzles.json'
MAX_QUOTE_LENGTH = 20

with open(QUOTES_FILE, errors='replace') as qfile:
    quotes = json.loads(qfile.read())

def is_short_quote(quote):
    return len(quote['Quote']) < MAX_QUOTE_LENGTH

short_quotes = list(filter(is_short_quote, quotes))
short_quotes.sort(key=lambda q: q['Popularity'], reverse= True)

def format_quote(quote):
    quote = quote.lower()
    if quote.endswith('.'):
        return quote[:-1]
    else:
        return quote

mongo_entries = []
entered_quotes = []
for q in map(lambda q: q['Quote'], short_quotes):
    if format_quote(q) not in entered_quotes:
        entered_quotes.append(format_quote(q))
        mongo_entries.append({
            'etaki': format_quote(q),
            'katieEtaki': format_quote(q)
            })

with open(PUZZLES_FILE, 'w') as pfile:
    pfile.write(json.dumps(mongo_entries))


