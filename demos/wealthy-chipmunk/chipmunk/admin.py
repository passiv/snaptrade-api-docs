from django.contrib import admin

from . import models

# Register your models here.
admin.site.register(models.UserManager)
admin.site.register(models.UserSecret)
