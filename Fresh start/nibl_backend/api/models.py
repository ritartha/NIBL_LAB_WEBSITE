from django.db import models


class Member(models.Model):
    ROLE_CHOICES = [
        ('professor', 'Professor'),
        ('associate_professor', 'Associate Professor'),
        ('scientific_officer', 'Scientific Officer'),
        ('post_doc', 'Post Doctoral Researcher'),
        ('project_associate', 'Project Associate'),
        ('student', 'Student'),
    ]

    name = models.CharField(max_length=200)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES)
    designation = models.CharField(max_length=200)
    experience_years = models.PositiveIntegerField(default=0)
    description = models.TextField(blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    photo = models.ImageField(upload_to='members/', blank=True, null=True)
    linkedin_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    researchgate_url = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['display_order', 'name']

    def __str__(self):
        return f"{self.name} - {self.designation}"


class BeamTimeRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('under_review', 'Under Review'),
        ('approved', 'Approved'),
        ('scheduled', 'Scheduled'),
        ('completed', 'Completed'),
        ('rejected', 'Rejected'),
    ]

    # Personal details
    full_name = models.CharField(max_length=200)
    role = models.CharField(max_length=50)
    affiliation = models.CharField(max_length=300)
    reference = models.CharField(max_length=200, blank=True)
    email = models.EmailField()
    phone = models.CharField(max_length=20)

    # Beam requirements
    beam_energy = models.FloatField(help_text="Energy in KeV (max 400)")
    beam_current = models.FloatField(help_text="Current in µA")
    source_element = models.CharField(max_length=50)
    sample_details = models.TextField()

    # Schedule
    tentative_date = models.DateField()
    accommodation_required = models.BooleanField(default=False)

    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    admin_notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.full_name} - {self.beam_energy}KeV - {self.status}"


class AccommodationPerson(models.Model):
    beam_time_request = models.ForeignKey(
        BeamTimeRequest,
        on_delete=models.CASCADE,
        related_name='accommodation_people'
    )
    name = models.CharField(max_length=200)
    role = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.name} ({self.role})"


class GalleryAlbum(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    icon_class = models.CharField(max_length=50, default='fas fa-images')
    display_order = models.PositiveIntegerField(default=0)
    is_visible = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['display_order']

    def __str__(self):
        return self.title


class GalleryPhoto(models.Model):
    album = models.ForeignKey(
        GalleryAlbum,
        on_delete=models.CASCADE,
        related_name='photos'
    )
    image = models.ImageField(upload_to='gallery/')
    alt_text = models.CharField(max_length=200, blank=True)
    display_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['display_order']

    def __str__(self):
        return f"{self.album.title} - {self.alt_text or 'Photo'}"


class Update(models.Model):
    title = models.CharField(max_length=300)
    description = models.TextField()
    date_label = models.CharField(max_length=100, help_text="e.g. 'October 2025 - Ongoing'")
    is_published = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['display_order', '-created_at']

    def __str__(self):
        return self.title


class ResearchArea(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    icon_class = models.CharField(max_length=50, default='fas fa-atom')
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['display_order']

    def __str__(self):
        return self.title