from rest_framework import viewsets
from .models import Member, GalleryAlbum, GalleryPhoto, BeamTimeRequest, LogEntry, Update
from .serializers import (
    MemberSerializer,
    GalleryAlbumSerializer,
    GalleryPhotoSerializer,
    BeamTimeRequestSerializer,
    LogEntrySerializer,
    UpdateSerializer,
)


class MemberViewSet(viewsets.ModelViewSet):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer


class GalleryAlbumViewSet(viewsets.ModelViewSet):
    queryset = GalleryAlbum.objects.all()
    serializer_class = GalleryAlbumSerializer


class GalleryPhotoViewSet(viewsets.ModelViewSet):
    queryset = GalleryPhoto.objects.all()
    serializer_class = GalleryPhotoSerializer


class BeamTimeRequestViewSet(viewsets.ModelViewSet):
    queryset = BeamTimeRequest.objects.all()
    serializer_class = BeamTimeRequestSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'head', 'options']


class LogEntryViewSet(viewsets.ModelViewSet):
    queryset = LogEntry.objects.all()
    serializer_class = LogEntrySerializer
    http_method_names = ['get', 'post', 'head', 'options']


class UpdateViewSet(viewsets.ModelViewSet):
    queryset = Update.objects.all()
    serializer_class = UpdateSerializer
