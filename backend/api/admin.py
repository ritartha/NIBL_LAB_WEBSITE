from django.contrib import admin
from .models import Member, GalleryAlbum, GalleryPhoto, BeamTimeRequest, LogEntry, Update


@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ('name', 'role', 'email', 'experience_years', 'is_active')
    search_fields = ('name', 'role', 'email')


@admin.register(GalleryAlbum)
class GalleryAlbumAdmin(admin.ModelAdmin):
    list_display = ('title', 'icon_class', 'order', 'created_at')
    search_fields = ('title',)


@admin.register(GalleryPhoto)
class GalleryPhotoAdmin(admin.ModelAdmin):
    list_display = ('album', 'alt_text', 'order', 'uploaded_at')
    search_fields = ('alt_text', 'album__title')


@admin.register(BeamTimeRequest)
class BeamTimeRequestAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'beam_energy', 'tentative_date', 'status', 'created_at')
    search_fields = ('full_name', 'email', 'affiliation')


@admin.register(LogEntry)
class LogEntryAdmin(admin.ModelAdmin):
    list_display = ('operator', 'energy', 'source_element', 'user_name', 'logged_by', 'created_at')
    search_fields = ('operator', 'user_name', 'source_element', 'logged_by')


@admin.register(Update)
class UpdateAdmin(admin.ModelAdmin):
    list_display = ('title', 'date_label', 'created_at')
    search_fields = ('title', 'description')
