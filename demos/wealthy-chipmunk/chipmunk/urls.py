from django.urls import path

from . import views

urlpatterns = [
    path("home/", views.home),
    path("passiv_login/", views.passiv_login),
    path("symbol_redirect/", views.symbol_redirect),
    path("", views.home, name="index"),
]
