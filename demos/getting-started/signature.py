import os
import hmac
import json
import time
from base64 import b64encode
from hashlib import sha256
from urllib.parse import urlparse, urlencode
import requests

try:
    CLIENT_ID = os.environ["SNAPTRADE_CLIENT_ID"]
except KeyError:
    CLIENT_ID = "[ENTER-YOUR-CLIENT-ID-HERE-IF-YOU-DONT-LIKE-ENVVARS]"

try:
    CONSUMER_KEY = os.environ["SNAPTRADE_CONSUMER_KEY"]
except KeyError:
    CONSUMER_KEY = "[ENTER-YOUR-KEY-HERE-IF-YOU-DONT-LIKE-ENVVARS]"

try:
    USER_ID = os.environ["SNAPTRADE_USER_ID"]
except KeyError:
    USER_ID = "[ENTER-YOUR-USER-ID-HERE-IF-YOU-DONT-LIKE-ENVVARS]"

consumer_key_encoded = CONSUMER_KEY.encode()

base_api = "https://api.passiv.com/api/v1"

holdings_endpoint = "/snapTrade/holdings"

params = dict(
    clientId=CLIENT_ID,
    userId=USER_ID,
    timestamp=int(time.time()),
)

url = base_api + holdings_endpoint

req = requests.Request(
    method="get",
    url=base_api + holdings_endpoint,
    params=params,
)

request_data = None

parsed_url = urlparse(url)
request_path = parsed_url.path
request_query = urlencode(params)

sig_object = {"content": request_data, "path": request_path, "query": request_query}

sig_content = json.dumps(sig_object, separators=(",", ":"), sort_keys=True)
sig_digest = hmac.new(consumer_key_encoded, sig_content.encode(), sha256).digest()

signature = b64encode(sig_digest).decode()

req.headers["Signature"] = signature


res = requests.get(url, headers=dict(Signature=signature), params=params, data=request_data)
