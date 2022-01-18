import hmac
import json
import time
from base64 import b64encode
from hashlib import sha256
from urllib.parse import urlencode

import requests
from chipmunk.models import Account, UserManager, UserSecret

from snaptrade_mock import settings


class SnapTradeWrapper:
    # base_url = "https://api.delta.passiv.com/api/v1/"
    base_url = "https://api.passiv.com/api/v1/"

    endpoints = {
        "register": {
            "endpoint": "snapTrade/registerUser",
            "method": "post",
            "path_params": (),
            "query_params": (
                "partner_id",
                "timestamp",
            ),
        },
        "login": {
            "endpoint": "snapTrade/login",
            "method": "post",
            "path_params": (),
            "query_params": (
                "partner_id",
                "timestamp",
            ),
        },
        "delete_user": {
            "endpoint": "snapTrade/deleteUser",
            "method": "post",
            "path_params": (),
            "query_params": (
                "partner_id",
                "timestamp",
            ),
        },
        "holdings": {
            "endpoint": "snapTrade/holdings",
            "method": "get",
            "path_params": (),
            "query_params": ("partner_id", "timestamp", "accounts", "userId"),
        },
    }

    def __init__(self, user):
        self.snaptrade_consumer_key = settings.SNAPTRADE_PROD_CONSUMER_KEY.encode()
        self.snaptrade_partner_id = settings.SNAPTRADE_PROD_PARTNER_ID
        # self.snaptrade_consumer_key = settings.SNAPTRADE_DELTA_CONSUMER_KEY.encode()
        # self.snaptrade_partner_id = settings.SNAPTRADE_DELTA_PARTNER_ID
        self.user = user

    def sign_request(self, request_data, request_path, request_query):
        sig_object = {"content": request_data, "path": request_path, "query": request_query}

        sig_content = json.dumps(sig_object, separators=(",", ":"), sort_keys=True)

        sig_digest = hmac.new(self.snaptrade_consumer_key, sig_content.encode(), sha256).digest()

        signature = b64encode(sig_digest).decode()

        return signature

    def get_signature(self, request_data, request_path=None, request_query=None):
        if request_query:
            request_query_string = urlencode(request_query)
        else:
            request_query_string = ""

        return self.sign_request(request_data, request_path, request_query_string)

    def _generate_request_path(self, endpoint_name, **path_params):
        """Generates API endpoint based on endpoint_name and params given"""
        endpoint = self.endpoints[endpoint_name]

        return "/api/v1/%s" % (endpoint["endpoint"] % path_params)

    def _generate_api_endpoint(self, endpoint_name, **path_params):
        """Generates API endpoint based on endpoint_name and params given"""
        endpoint = self.endpoints[endpoint_name]

        return "%s%s" % (self.base_url, endpoint["endpoint"] % path_params)

    def _make_request(self, endpoint_name, data=None, path_params=None, query_params=None, basic_auth=False):
        if path_params is None:
            path_params = {}

        request_path = self._generate_request_path(endpoint_name, **path_params)

        signature = self.get_signature(data, request_path, query_params)

        endpoint = self._generate_api_endpoint(endpoint_name, **path_params)

        headers = {"Signature": signature}

        method = self.endpoints[endpoint_name]["method"]

        if method == "post":
            response = requests.post(endpoint, headers=headers, params=query_params, json=data, verify=False)
        elif method == "get":
            response = requests.get(endpoint, headers=headers, params=query_params, verify=False)
        elif method == "delete":
            response = requests.delete(
                endpoint, headers=headers, params=query_params, verify=False, auth=generated_auth
            )

        return response

    def register_user(self):
        endpoint = "register"

        partner_id = self.snaptrade_partner_id
        timestamp = round(time.time())

        query_params = dict(partnerId=partner_id, timestamp=timestamp)
        data = dict(userId=self.user.email)

        response = self._make_request(endpoint, query_params=query_params, data=data)

        if response.status_code == 200:
            token = response.json().get("userSecret")
            UserSecret.save_token(self.user, token)

    def delete_user(self):
        endpoint = "delete_user"

        partner_id = self.snaptrade_partner_id
        timestamp = round(time.time())

        user_secret_obj = UserSecret.objects.filter(user=self.user).first()

        if user_secret_obj:
            token = user_secret_obj.token
            query_params = dict(partnerId=partner_id, timestamp=timestamp)
            data = dict(userId=self.user.email, userSecret=token)
            response = self._make_request(endpoint, data=data, query_params=query_params)

        if response.status_code == 200:
            user_secret_obj.delete()

    def login_user_redirect(self):
        endpoint = "login"

        partner_id = self.snaptrade_partner_id
        timestamp = round(time.time())

        query_params = dict(partnerId=partner_id, timestamp=timestamp)

        token = UserSecret.get_token_by_user(self.user)
        data = dict(userId=self.user.email, userSecret=token)

        response = self._make_request(endpoint, query_params=query_params, data=data)

        if response.status_code == 200:
            return response.json()

    def account_holdings(self, accounts=None):
        endpoint = "holdings"

        partner_id = self.snaptrade_partner_id
        timestamp = round(time.time())

        query_params = dict(partnerId=partner_id, timestamp=timestamp, userId=self.user.email)

        if accounts:
            accounts_numbers = ",".join(accounts)
            query_params["accounts"] = accounts_numbers

        response = self._make_request(endpoint, query_params=query_params, basic_auth=True)

        if True:
            if response.status_code == 200:
                accounts_holdings = response.json()
                for account_holdings in accounts_holdings:
                    account_data = account_holdings.get("account")
                    account_number = account_data.get("number")
                    account_brokerage = account_data.get("brokerage")
                    account_name = account_data.get("name")

                    account = Account.objects.filter(
                        user=self.user, number=account_number, brokerage=account_brokerage
                    ).first()

                    if not account:
                        Account.objects.create(
                            user=self.user, number=account_number, brokerage=account_brokerage, description=account_name
                        )
            else:
                return []

            return accounts_holdings
