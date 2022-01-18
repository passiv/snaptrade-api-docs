from chipmunk.models import UserManager
from django import forms
from django.contrib.auth import password_validation
from django.contrib.auth.forms import UserCreationForm


class RegistrationForm(forms.Form):
    email = forms.EmailField(max_length=250, widget=forms.TextInput(attrs=dict(placeholder=("Email"))), required=True)
    password = forms.CharField(
        widget=forms.PasswordInput(attrs=dict(render_value=False, placeholder=("Password"))), required=True
    )

    def _post_clean(self):
        super()._post_clean()
        password = self.cleaned_data.get("password")
        if password:
            try:
                password_validation.validate_password(password)
            except forms.ValidationError as error:
                self.add_error("password", error)

    def clean_email(self):
        try:
            UserManager.objects.get(email__iexact=self.cleaned_data["email"])
        except UserManager.DoesNotExist:
            return self.cleaned_data["email"]
        raise forms.ValidationError(("The email already exists. Please try another one."))

    def create_user(self):
        user = UserManager.objects.create(email=self.cleaned_data["email"], username=self.cleaned_data["email"])
        user.set_password(self.cleaned_data["password"])
        user.save()
        return user
