import pandas
import json
import re

PHRASES_FILE = "../data/English_phrases_and_sayings.csv"
OUT_FILE = "../data/puzzles/phrase_puzzles.json"


phrases_df = pandas.read_csv(PHRASES_FILE, index_col=0)
phrases = list(phrases_df["text"])

REPLACE_CHARACTERS = {
    '"': '',
    '(': '',
    ')': '',
    'à': 'a',
    'é': 'e'

}
def clean_phrase(phrase):
    phrase = phrase.lower().strip()
    for c, v in REPLACE_CHARACTERS.items():
        phrase = phrase.replace(c,v)
    
    if re.search(r' - ', phrase):
        split_phrase = phrase.split(' - ')
        phrase = f"{split_phrase[1]} {split_phrase[0]}"
    return phrase

puzzles = [{ 'etaki': clean_phrase(phrase), 'katieEtaki': clean_phrase(phrase) } for phrase in phrases]

with open(OUT_FILE, 'w') as outfile:
    outfile.write(json.dumps(puzzles))