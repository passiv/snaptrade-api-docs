from django.contrib.auth.models import User
from django.db import models


# Create your models here.
class UserManager(User):
    class Meta:
        proxy = True


class UserManagerMixin(models.Model):
    user = models.ForeignKey(UserManager, on_delete=models.CASCADE)

    class Meta:
        abstract = True


class UserSecret(UserManagerMixin):
    token = models.TextField()

    @classmethod
    def save_token(cls, user, token):
        cls.objects.create(user=user, token=token)

    @classmethod
    def get_token_by_user(cls, user):
        return cls.objects.get(user=user).token


class Account(UserManagerMixin):
    number = models.TextField()
    brokerage = models.TextField()
    description = models.TextField()
