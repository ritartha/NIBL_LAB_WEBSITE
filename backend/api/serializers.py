from rest_framework import serializers
from .models import Member, GalleryAlbum, GalleryPhoto, BeamTimeRequest, LogEntry, Update


class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = '__all__'


class GalleryPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryPhoto
        fields = '__all__'


class GalleryAlbumSerializer(serializers.ModelSerializer):
    photos = GalleryPhotoSerializer(many=True, read_only=True)

    class Meta:
        model = GalleryAlbum
        fields = '__all__'


class BeamTimeRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = BeamTimeRequest
        fields = '__all__'


class LogEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = LogEntry
        fields = '__all__'


class UpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Update
        fields = '__all__'
