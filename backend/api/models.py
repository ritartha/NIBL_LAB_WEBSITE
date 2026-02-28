from django.core.validators import MaxValueValidator
from django.db import models


class Member(models.Model):
    name = models.CharField(max_length=200)
    role = models.CharField(max_length=200)
    email = models.EmailField()
    experience_years = models.IntegerField(default=0)
    description = models.TextField(blank=True)
    photo_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    research_url = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.role}"

    class Meta:
        ordering = ['name']


class GalleryAlbum(models.Model):
    title = models.CharField(max_length=200)
    icon_class = models.CharField(max_length=100, default='fas fa-images')
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['order']


class GalleryPhoto(models.Model):
    album = models.ForeignKey(GalleryAlbum, on_delete=models.CASCADE, related_name='photos')
    image_url = models.URLField()
    alt_text = models.CharField(max_length=200, blank=True)
    order = models.IntegerField(default=0)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.album.title} - {self.alt_text}"

    class Meta:
        ordering = ['order']


class BeamTimeRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('reviewing', 'Under Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('scheduled', 'Scheduled'),
        ('completed', 'Completed'),
    ]

    full_name = models.CharField(max_length=200)
    role = models.CharField(max_length=100)
    affiliation = models.CharField(max_length=300)
    reference = models.CharField(max_length=200, blank=True)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    beam_energy = models.FloatField(
        help_text="Energy in KeV (max 400)",
        validators=[MaxValueValidator(400)],
    )
    beam_current = models.FloatField(help_text="Current in µA")
    source_element = models.CharField(max_length=100)
    sample_details = models.CharField(max_length=500)
    tentative_date = models.DateField()
    accommodation_required = models.BooleanField(default=False)
    accommodation_people = models.IntegerField(default=0)
    additional_notes = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.full_name} - {self.beam_energy}KeV - {self.status}"

    class Meta:
        ordering = ['-created_at']


class LogEntry(models.Model):
    operator = models.CharField(max_length=200)
    energy = models.FloatField(help_text="Energy in KeV")
    beam_current = models.FloatField(help_text="Current in µA")
    source_element = models.CharField(max_length=100)
    target_sample = models.CharField(max_length=200)
    anode_current = models.FloatField(help_text="Anode current in A")
    filament_current = models.FloatField(help_text="Filament current in A")
    oven_current = models.FloatField(help_text="Oven current in A")
    gas_control = models.FloatField(help_text="Gas control in %")
    user_name = models.CharField(max_length=200)
    user_institute = models.CharField(max_length=300)
    supervisor = models.CharField(max_length=200, blank=True)
    logged_by = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.operator} - {self.energy}KeV - {self.created_at.strftime('%Y-%m-%d %H:%M')}"

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = "Log Entries"


class Update(models.Model):
    title = models.CharField(max_length=300)
    description = models.TextField()
    date_label = models.CharField(max_length=100, help_text="Display date e.g. 'October 2025'")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']
