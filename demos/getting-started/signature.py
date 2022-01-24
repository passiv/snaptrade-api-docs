import os
import hmac
import json
import time
from base64 import b64encode
from hashlib import sha256
from urllib.parse import urlencode
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

holdings_endpoint = "/holdings"

req = requests.Request(
    method="get",
    url=base_api + holdings_endpoint,
    params=dict(
        clientId=CLIENT_ID,
        userId=USER_ID,
    ),
)

request_data = {'userId': 'api@passiv.com', 'userSecret': 'CHRIS.P.BACON'}
request_path = "/api/v1/snapTrade/mockSignature"
request_query = "clientId=PASSIVTEST&timestamp=1635790389"

sig_object = {"content": request_data, "path": request_path, "query": request_query}

sig_content = json.dumps(sig_object, separators=(",", ":"), sort_keys=True)
sig_digest = hmac.new(consumer_key, sig_content.encode(), sha256).digest()

signature = b64encode(sig_digest).decode()

