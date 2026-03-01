from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from api import views

urlpatterns = [
    # Admin panel
    path('admin/', admin.site.urls),

    # REST API
    path('api/', include('api.urls')),

    # Frontend HTML pages served by Django
    path('', views.index, name='home'),
    path('index.html', views.index),
    path('about.html', views.about),
    path('beam-time.html', views.beam_time),
    path('gallery.html', views.gallery),
    path('logging.html', views.logging_page),
    path('members.html', views.members),
    path('404.html', views.page_404),
]

# Serve static and media files in development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static('/img/', document_root=settings.MEDIA_ROOT)