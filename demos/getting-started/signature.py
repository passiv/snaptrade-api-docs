# 
# run this from a command line like so:
#     SNAPTRADE_CLIENT_ID="ABC" SNAPTRADE_CONSUMER_KEY="XYZ" SNAPTRADE_USER_ID="demo@your-domain.com" python signature.py
#

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


def create_request(endpoint, method, data=None, user_id=None):
    params = dict(
        clientId=CLIENT_ID,
        timestamp=int(time.time()),
    )
    if user_id is not None:
        params.update(dict(userId=user_id))

    url = base_api + endpoint

    req = requests.Request(
        method=method,
        url=url,
        params=params,
        data=data,
    )

    return sign_request(req)

def sign_request(req):
    parsed_url = urlparse(req.url)
    request_path = parsed_url.path
    request_query = urlencode(req.params)

    sig_object = {"content": req.data if req.data != [] else None, "path": request_path, "query": request_query}

    sig_content = json.dumps(sig_object, separators=(",", ":"), sort_keys=True)
    sig_digest = hmac.new(consumer_key_encoded, sig_content.encode(), sha256).digest()

    signature = b64encode(sig_digest).decode()

    req.headers["Signature"] = signature

    return req

def send_request(req):
    session = requests.Session()
    prepped = session.prepare_request(req)
    res = session.send(prepped)
    return res


# Register a SnapTrade user

user_id = USER_ID

print()
print("Attempting to create user %s ..." % user_id)

req = create_request(
    "/snapTrade/registerUser",
    "post",
    data=dict(userId=user_id),
)
res = send_request(req)
user_data = res.json()

assert user_id == user_data.get("userId")

user_secret = user_data.get("userSecret")

print()
print("User %s created. Now generating a Connection Portal link..." % user_id)
print()


# Generate a Connection Portal link for the new SnapTrade user

req = create_request(
    "/snapTrade/login",
    "post",
    data=dict(
        userId=user_id,
        userSecret=user_secret,
    ),
)
res = send_request(req)

redirectURI = res.json().get("redirectURI")

print()
print("Open this link in a browser:", redirectURI)
print()
print("Only continue when you have finished connecting your account.")
print()

input("Press [enter] to continue when you are ready.")


# Pull holdings data for the new SnapTrade user

req = create_request(
    "/snapTrade/holdings",
    "get",
    user_id=user_id
)
res = send_request(req)

print()
print("Holdings for %s:" % user_id)
print()
print(res.json())
print()
print("Congrats, you've completed the SnapTrade signature tutorial!")

