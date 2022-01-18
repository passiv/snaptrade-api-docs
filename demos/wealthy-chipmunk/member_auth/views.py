from chipmunk.models import UserManager
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import redirect, render
from django.urls import reverse_lazy
from member_auth.forms import RegistrationForm


def register_page(request):
    context = {}

    if request.user.is_authenticated:
        return redirect("/chipmunk/home")

    if request.method == "POST":
        email = request.POST.get("email")
        password = request.POST.get("password")

        form_data = {"email": email, "password": password}

        form = RegistrationForm(form_data)

        user = UserManager.objects.filter(email=email).first()

        if form.is_valid() and not user:
            form.create_user()
            return redirect("login")

        context = {"form": form}

    return render(request, "registration/register.html", context)


def login_page(request):
    context = {}
    if request.user.is_authenticated:
        return redirect("/chipmunk/home")

    if request.method == "POST":
        email = request.POST.get("email")
        password = request.POST.get("password")

        user = UserManager.objects.filter(email=email).first()

        if user and user.check_password(password):
            login(request, user)
            return redirect("/chipmunk/home")
        else:
            messages.info(request, "Username OR password is incorrect")
            return render(request, "registration/login.html", context)

    return render(request, "registration/login.html", context)


def logout_user(request):
    logout(request)
    return redirect("login")
