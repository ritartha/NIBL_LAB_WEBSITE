"""URL configuration for nibl_project."""

import os
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve

urlpatterns = [
    # Admin panel
    path('admin/', admin.site.urls),

    # REST API endpoints
    path('api/', include('api.urls')),

    # Frontend HTML pages
    path('', TemplateView.as_view(template_name='index.html'), name='home'),
    path('index.html', TemplateView.as_view(template_name='index.html'), name='index'),
    path('about.html', TemplateView.as_view(template_name='about.html'), name='about'),
    path('beam-time.html', TemplateView.as_view(template_name='beam-time.html'), name='beam-time'),
    path('members.html', TemplateView.as_view(template_name='members.html'), name='members'),
    path('gallery.html', TemplateView.as_view(template_name='gallery.html'), name='gallery'),
    path('logging.html', TemplateView.as_view(template_name='logging.html'), name='logging'),
    path('enhanced-nibl-logger.html', TemplateView.as_view(template_name='enhanced-nibl-logger.html'), name='enhanced-logger'),
    path('404.html', TemplateView.as_view(template_name='404.html'), name='404'),
]

# Serve static files (CSS, JS, Images) during development
if settings.DEBUG:
    # Serve CSS files from web/css/
    urlpatterns += [
        re_path(
            r'^css/(?P<path>.*)$',
            serve,
            {'document_root': os.path.join(settings.BASE_DIR.parent, 'web', 'css')},
        ),
    ]

    # Serve JS files from web/js/
    urlpatterns += [
        re_path(
            r'^js/(?P<path>.*)$',
            serve,
            {'document_root': os.path.join(settings.BASE_DIR.parent, 'web', 'js')},
        ),
    ]

    # Serve image files from web/img/
    urlpatterns += [
        re_path(
            r'^img/(?P<path>.*)$',
            serve,
            {'document_root': os.path.join(settings.BASE_DIR.parent, 'web', 'img')},
        ),
    ]

    # Serve media files (uploads)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)