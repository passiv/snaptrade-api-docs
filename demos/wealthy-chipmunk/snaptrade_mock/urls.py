from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("chipmunk/", include("chipmunk.urls")),
    path("member-auth/", include("member_auth.urls")),
]
