from django.contrib import admin
from .models import (
    Member, BeamTimeRequest, AccommodationPerson,
    GalleryAlbum, GalleryPhoto, Update, ResearchArea
)


@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ['name', 'designation', 'email', 'is_active', 'display_order']
    list_editable = ['is_active', 'display_order']
    search_fields = ['name', 'email']
    list_filter = ['role', 'is_active']


class AccommodationPersonInline(admin.TabularInline):
    model = AccommodationPerson
    extra = 0


@admin.register(BeamTimeRequest)
class BeamTimeRequestAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'beam_energy', 'source_element', 'status', 'tentative_date', 'created_at']
    list_filter = ['status', 'accommodation_required']
    search_fields = ['full_name', 'email', 'affiliation']
    list_editable = ['status']
    inlines = [AccommodationPersonInline]


class GalleryPhotoInline(admin.TabularInline):
    model = GalleryPhoto
    extra = 3


@admin.register(GalleryAlbum)
class GalleryAlbumAdmin(admin.ModelAdmin):
    list_display = ['title', 'is_visible', 'display_order']
    list_editable = ['is_visible', 'display_order']
    inlines = [GalleryPhotoInline]


@admin.register(Update)
class UpdateAdmin(admin.ModelAdmin):
    list_display = ['title', 'date_label', 'is_published', 'display_order']
    list_editable = ['is_published', 'display_order']


@admin.register(ResearchArea)
class ResearchAreaAdmin(admin.ModelAdmin):
    list_display = ['title', 'icon_class', 'display_order']
    list_editable = ['display_order']