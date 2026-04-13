"""
URL configuration for DDGolf project.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/accounts/", include("accounts.urls")),
    path("api/boards/", include("boards.urls")),
    path("api/gallery/", include("gallery.urls")),
    path("api/notices/", include("notices.urls")),
    path("api/schedule/", include("schedule.urls")),
    path("api/messenger/", include("messenger.urls")),
    path("api/sms/", include("sms.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
