import urllib

from chipmunk.integrations import SnapTradeWrapper
from chipmunk.models import Account, UserManager, UserSecret
from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.shortcuts import redirect, render, reverse


@login_required(login_url="/member-auth/login")
def home(request):
    try:
        stw = SnapTradeWrapper(request.user)
        holdings = stw.account_holdings()
        context = dict(holdings=holdings)
    except:
        context = {}

    return render(request, "home.html", context)


@login_required(login_url="/member-auth/login")
def passiv_login(request):
    user = request.user

    user_secret = UserSecret.objects.filter(user=user).first()

    stw = SnapTradeWrapper(user)

    if not user_secret:
        stw.register_user()
        user_secret = UserSecret.objects.filter(user=user).first()

    if user_secret:
        redirect_uri_response = stw.login_user_redirect()

        if redirect_uri_response:
            redirect_uri = redirect_uri_response.get("redirectURI")

            return redirect(redirect_uri)

    context = {"error": "Failed to login"}
    return render(request, "home.html", context)


@login_required(login_url="/member-auth/login")
def symbol_redirect(request):
    user = request.user

    query_string = request.environ.get("QUERY_STRING")
    symbol = urllib.parse.parse_qs(query_string).get("symbol")[0]

    user_secret = UserSecret.objects.filter(user=user).first()
    stw = SnapTradeWrapper(user)

    if not user_secret:
        stw.register_user()
        user_secret = UserSecret.objects.filter(user=user).first()

    if user_secret:
        redirect_uri_response = stw.login_user_redirect()

        if redirect_uri_response:

            redirect_uri = redirect_uri_response.get("redirectURI")
            redirect_uri += f"&symbol={symbol}"
            return redirect(redirect_uri)

        context = {"error": "Failed to login"}
    return render(request, "home.html", context)
