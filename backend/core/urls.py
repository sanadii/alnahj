"""
URL configuration for Election Management System.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # API
    path('api/auth/', include('apps.account.urls')),
    path('api/users/', include('apps.account.urls_users')),
    path('api/elections/', include('apps.elections.urls')),
    path('api/electors/', include('apps.electors.urls')),
    path('api/candidates/', include('apps.candidates.urls')),
    path('api/guarantees/', include('apps.guarantees.urls')),
    path('api/attendees/', include('apps.attendees.urls')),
    path('api/reports/', include('apps.reports.urls')),
    path('api/voting/', include('apps.voting.urls')),
    path('api/demos/', include('apps.demos.urls')),
    path('api/utils/', include('apps.utils.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Customize admin site
admin.site.site_header = 'Election Management System'
admin.site.site_title = 'Election Admin'
admin.site.index_title = 'Administration'
