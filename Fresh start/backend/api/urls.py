from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'members', views.MemberViewSet)
router.register(r'beam-time-requests', views.BeamTimeRequestViewSet)
router.register(r'log-entries', views.LogEntryViewSet)          # ← ADD THIS
router.register(r'gallery/albums', views.GalleryAlbumViewSet)
router.register(r'updates', views.UpdateViewSet)
router.register(r'research-areas', views.ResearchAreaViewSet)

urlpatterns = [
    path('', include(router.urls)),
]