from rest_framework import viewsets
from django.shortcuts import render

from .models import (
    Member, BeamTimeRequest, LogEntry, GalleryAlbum, Update, ResearchArea
)
from .serializers import (
    MemberSerializer, BeamTimeRequestSerializer, LogEntrySerializer,
    GalleryAlbumSerializer, UpdateSerializer, ResearchAreaSerializer
)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  REST API ViewSets
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class MemberViewSet(viewsets.ReadOnlyModelViewSet):
    """GET /api/members/ — list active members"""
    queryset = Member.objects.filter(is_active=True)
    serializer_class = MemberSerializer


class BeamTimeRequestViewSet(viewsets.ModelViewSet):
    """
    GET  /api/beam-time-requests/ — list all requests
    POST /api/beam-time-requests/ — submit a new request
    """
    queryset = BeamTimeRequest.objects.all()
    serializer_class = BeamTimeRequestSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        status_filter = self.request.query_params.get('status')
        if status_filter:
            qs = qs.filter(status=status_filter)
        return qs


# ========================
# ADD THIS — was missing
# ========================
class LogEntryViewSet(viewsets.ModelViewSet):
    """
    GET  /api/log-entries/ — list all log entries
    POST /api/log-entries/ — submit a new log entry
    """
    queryset = LogEntry.objects.all()
    serializer_class = LogEntrySerializer
    http_method_names = ['get', 'post', 'head', 'options']


class GalleryAlbumViewSet(viewsets.ReadOnlyModelViewSet):
    """GET /api/gallery/albums/ — albums with nested photos"""
    queryset = GalleryAlbum.objects.filter(is_visible=True).prefetch_related('photos')
    serializer_class = GalleryAlbumSerializer


class UpdateViewSet(viewsets.ReadOnlyModelViewSet):
    """GET /api/updates/ — published updates"""
    queryset = Update.objects.filter(is_published=True)
    serializer_class = UpdateSerializer


class ResearchAreaViewSet(viewsets.ReadOnlyModelViewSet):
    """GET /api/research-areas/"""
    queryset = ResearchArea.objects.all()
    serializer_class = ResearchAreaSerializer


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  Frontend page views (serve HTML templates)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def index(request):
    return render(request, 'index.html')

def about(request):
    return render(request, 'about.html')

def beam_time(request):
    return render(request, 'beam-time.html')

def gallery(request):
    return render(request, 'gallery.html')

def logging_page(request):
    return render(request, 'logging.html')

def enhanced_logger(request):
    return render(request, 'enhanced-nibl-logger.html')

def members(request):
    return render(request, 'members.html')

def page_404(request):
    return render(request, '404.html')