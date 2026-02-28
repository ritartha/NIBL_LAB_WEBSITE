from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import (
    MemberViewSet,
    GalleryAlbumViewSet,
    GalleryPhotoViewSet,
    BeamTimeRequestViewSet,
    LogEntryViewSet,
    UpdateViewSet,
)

router = DefaultRouter()
router.register(r'members', MemberViewSet)
router.register(r'gallery-albums', GalleryAlbumViewSet)
router.register(r'gallery-photos', GalleryPhotoViewSet)
router.register(r'beam-time-requests', BeamTimeRequestViewSet)
router.register(r'log-entries', LogEntryViewSet)
router.register(r'updates', UpdateViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
