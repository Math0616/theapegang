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

# Your private ME API KEY
api_key = os.environ.get('MAGICEDEN_API_KEY')

def fetch_tokens(api_key, base_url, token_ids, max_tokens=2091):
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    all_tokens = []

    # Additional parameters
    extra_params = "&showAll=false&sortBy=priceAsc"

    # Split the token_ids into batches of 20
    for i in range(0, len(token_ids), 20):
        batch = token_ids[i:i+20]
        token_ids_param = "&".join([f"tokenIds={tid}" for tid in batch])
        url = f"{base_url}?{token_ids_param}{extra_params}"

        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            print(f"Failed to fetch data: {response.status_code}")
            continue

        data = response.json()
        tokens = data.get("tokens", [])
        
        for token in tokens[:max_tokens]:
            token_data = {
                "id": token.get("id"),
                "listedPrice": format_price(int(token.get("listedPrice", 0)))
            }
            all_tokens.append(token_data)
            
            if len(all_tokens) >= max_tokens:
                break

        if len(all_tokens) >= max_tokens:
            break

    return all_tokens

# Prepare the list of all token IDs
token_ids = ["4cf9254ac5496b1c8b7779c048c6837d0cfede5ba5b7e2d8b19cad2de9fdf127i0", "1eb0f0f509cf9d2cf1686e4fe15f0f3f54d55c0331cb5965a91a4e2efac22a3fi0", "fdaa88df756982aa81d0119f0b474c53531a879389bc8990b37f0e9c66afe0bdi0","5f619cedcfc6febbf2a8207209867f5d485e97cc53627f1f3f3369b1ef3f72bbi0","5a50cdf57d981a3e561d9987d815bbb8c2e782e675ad914027ee1e49f09616c7i0","60d3eed479264f347acdeae90d72b333e62c864ce7611ef23c900da2acbad5dbi0","58dfb31cf8c5e88fd5d4e8bea4e2996769c5048f1c384b531ec9470118ada8f5i0","65d7e13b550d7ddc4be9cd24cdc7b69fab436c663320b772083fde4824336dcbi0","274c88a15f15cf506a3891eb11665ce39d39d3346ac4ab2c5808c2b5587a0611i0","e6310718d1ac8d381f52fbedc9a85b917f755bb37325ea497565a3920299e45ai0","95f77c6f696519f3f992d421f2f4596fb5147b73e6c86896307e1ac747d40ef3i0","eb1ce372c14bd736e14f3287587ba779ec8b5d7c0d20d3ead4bc711163eec561i0","197381205a2f3528be0bc965088220dd092bf993d40469a43392c9671aa75817i0","a94b61899dd21ca361c1b0452f025273491dd756fa8a1024fea5d635a5f50cd3i0","e41016471516f47f2e61ac5a20b25e0d0ff3d17eb7067436e4116a4101321f14i0","4f2e758e479dda702b16253ded14045a9dfad4d35595ddf3f16d76b9576185edi0","342ac1aef7802aa822f91c370071758b608a80e9a3c7edf0f25dcd7bf3bdddd8i0","3d1e88ae1070ccf623a8fd13380b474e64b768388c59119730ea4aa386fdc40di0","aaf75d277513aef8bfead6defdcf98cdb42facc075bc62afd3bab5bc3a85dca9i0","8c6a3038de3aafd48270b8891d211437cd0444a37af821b1fd85d430cc4e90fdi0","2455c3b97ad97be251ca4c82a0da66c1c583e218e3e527d2f87ed61bdcdc7018i0","6cbb14fd958c5e734c929b0a288497d9ab072288642275b784db2de797d0b768i0","1c8594b6ee351674ffc04a4ba28cb5a6500690ce4fe6d66549e920b0b4b14412i0"]  # Add all your token IDs here

# Base API URL
base_url = "https://api-mainnet.magiceden.dev/v2/ord/btc/tokens?"

tokens = fetch_tokens(api_key, base_url, token_ids)

# Writing the list of tokens to a JSON file
with open('tokens.json', 'w') as file:
    json.dump(tokens, file, indent=4)

print("Tokens saved to tokens.json")

def fetch_data(token_ids):
    base_url = "https://api-mainnet.magiceden.dev/v2/ord/btc/activities?collectionSymbol=omb&kind=buying_broadcasted"
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    all_responses = []

    for token_id in tqdm(token_ids, desc="Fetching Data"):
        url = f"{base_url}&tokenId={token_id}"
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            all_responses.append(response.json())  # Assuming JSON response
        else:
            print(f"Error fetching data for token {token_id}: {response.status_code}")

    return all_responses

data = fetch_data(token_ids)

# Writing data to a JSON file
with open('history.json', 'w') as file:
    json.dump(data, file, indent=2)

print("Data saved to history.json")
