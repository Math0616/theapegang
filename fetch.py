import os
import requests
from tqdm import tqdm
import json
import re

def format_price(price):
    # Convert to a float and create a string with a large number of decimal places
    price_str = "{:.8f}".format(price / 100000000)
    # Use regex to remove unnecessary trailing zeros, but leave at least two decimal places
    price_str = re.sub(r'(\.\d*?)0+\b', r'\1', price_str)
    # Ensure there are at least two decimal places
    if '.' in price_str and len(price_str.split('.')[1]) < 2:
        price_str += '0'
    return price_str

def fetch_tokens(api_key, token_ids, limit=40, max_tokens=2091):
    base_url = "https://api-mainnet.magiceden.dev/v2/ord/btc/tokens"
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    all_tokens = []
    
    with tqdm(total=min(max_tokens, len(token_ids)), desc="Fetching Tokens") as pbar:
        for token_id in token_ids:
            url = f"{base_url}?tokenIds={token_id}&showAll=false&sortBy=priceAsc"

            response = requests.get(url, headers=headers)
            if response.status_code != 200:
                print(f"Failed to fetch data for token {token_id}: {response.status_code}")
                continue

            data = response.json()
            tokens = data.get("tokens", [])
            for token in tokens:
                token_data = {
                    "id": token.get("id"),
                    "listedPrice": format_price(int(token.get("listedPrice", 0)))
                }
                all_tokens.append(token_data)

            pbar.update(1)
            if len(all_tokens) >= max_tokens:
                break

    return all_tokens

# Load token IDs from the JSON file
with open('images.json', 'r') as file:
    token_ids_data = json.load(file)
    token_ids = [item['id'] for item in token_ids_data]

# Your private ME API KEY
api_key = os.environ.get('MAGICEDEN_API_KEY')

tokens = fetch_tokens(api_key, token_ids)

# Writing the list of tokens to a JSON file
with open('tokens.json', 'w') as file:
    json.dump(tokens, file, indent=4)

print("Tokens saved to tokens.json")
