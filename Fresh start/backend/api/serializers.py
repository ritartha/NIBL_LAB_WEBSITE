from rest_framework import serializers
from .models import (
    Member, BeamTimeRequest, AccommodationPerson,
    GalleryAlbum, GalleryPhoto, LogEntry, Update, ResearchArea
)


class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = [
            'id', 'name', 'role', 'designation', 'experience_years',
            'description', 'email', 'phone', 'photo', 'linkedin_url',
            'github_url', 'researchgate_url', 'is_active', 'display_order',
        ]


class AccommodationPersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccommodationPerson
        fields = ['id', 'name', 'role']


class BeamTimeRequestSerializer(serializers.ModelSerializer):
    accommodation_people = AccommodationPersonSerializer(many=True, required=False)

    class Meta:
        model = BeamTimeRequest
        fields = [
            'id', 'full_name', 'role', 'affiliation', 'reference',
            'email', 'phone', 'beam_energy', 'beam_current',
            'source_element', 'sample_details', 'tentative_date',
            'accommodation_required', 'accommodation_people',
            'status', 'created_at',
        ]
        read_only_fields = ['status', 'created_at']

    def validate_beam_energy(self, value):
        if value > 400:
            raise serializers.ValidationError("Beam energy cannot exceed 400 KeV.")
        if value <= 0:
            raise serializers.ValidationError("Beam energy must be positive.")
        return value

    def create(self, validated_data):
        people_data = validated_data.pop('accommodation_people', [])
        request_obj = BeamTimeRequest.objects.create(**validated_data)
        for person in people_data:
            AccommodationPerson.objects.create(
                beam_time_request=request_obj, **person
            )
        return request_obj

    def update(self, instance, validated_data):
        people_data = validated_data.pop('accommodation_people', None)

        # Update the parent fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # If accommodation people were provided, replace them
        if people_data is not None:
            instance.accommodation_people.all().delete()
            for person in people_data:
                AccommodationPerson.objects.create(
                    beam_time_request=instance, **person
                )

        return instance


# ========================
# ADD THIS — was missing
# ========================
class LogEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = LogEntry
        fields = '__all__'


class GalleryPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryPhoto
        fields = ['id', 'image', 'alt_text', 'display_order']


class GalleryAlbumSerializer(serializers.ModelSerializer):
    photos = GalleryPhotoSerializer(many=True, read_only=True)

    class Meta:
        model = GalleryAlbum
        fields = ['id', 'title', 'description', 'icon_class', 'photos']


class UpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Update
        fields = ['id', 'title', 'description', 'date_label', 'created_at']


class ResearchAreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResearchArea
        fields = ['id', 'title', 'description', 'icon_class']