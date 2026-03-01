"""
Run: python manage.py shell < seed_data.py
Seeds the database with existing NIBL website data.
"""
import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nibl_project.settings')
django.setup()

from api.models import Member, GalleryAlbum, GalleryPhoto, Update

# ── Members ──
Member.objects.get_or_create(
    email='pratap.sahoo@niser.ac.in',
    defaults=dict(
        name='Dr. Pratap Kumar Sahoo',
        role='Associate Professor',
        experience_years=24,
        description='Leading the NIBL research team with expertise in nuclear physics and accelerator technology.',
        photo_url='img/pratap.sahoo260920231700.jpg',
        is_active=True,
    )
)

Member.objects.get_or_create(
    email='hpl@niser.ac.in',
    defaults=dict(
        name='Dr. Haraprasanna Lenka',
        role='Scientific Officer - E',
        experience_years=24,
        description='Expert in accelerator operations, beam tuning, and safety protocols.',
        photo_url='img/hpl170520242228.png',
        is_active=True,
    )
)

Member.objects.get_or_create(
    email='kalyan.ghosh@niser.ac.in',
    defaults=dict(
        name='Dr. Kalyan Ghosh',
        role='Post Doctoral Researcher',
        experience_years=8,
        description='Specialized in nuclear instrumentation development and beam diagnostic systems.',
        photo_url='img/_DSC2311.png',
        is_active=True,
    )
)

Member.objects.get_or_create(
    email='ritartha@niser.ac.in',
    defaults=dict(
        name='Mr. Ritartha Chaki',
        role='Project Associate - II',
        experience_years=3,
        description='Responsible for laboratory automation, data acquisition systems, and innovative solutions.',
        photo_url='img/images.jpg',
        linkedin_url='https://www.linkedin.com/in/ritartha-chaki-bab62ba8/',
        research_url='https://github.com/ritartha',
        is_active=True,
    )
)

# ── Gallery Albums & Photos ──
accl, _ = GalleryAlbum.objects.get_or_create(
    title='400 KeV Accelerator', defaults=dict(icon_class='fas fa-bolt', order=1)
)
for i in range(1, 11):
    GalleryPhoto.objects.get_or_create(
        album=accl, image_url=f'img/accl/{i}.jpg',
        defaults=dict(alt_text=f'Accelerator Photo {i}', order=i)
    )

install, _ = GalleryAlbum.objects.get_or_create(
    title='Installation Photos', defaults=dict(icon_class='fas fa-tools', order=2)
)
for i in range(1, 10):
    GalleryPhoto.objects.get_or_create(
        album=install, image_url=f'img/installation/{i}.jpg',
        defaults=dict(alt_text=f'Installation Photo {i}', order=i)
    )

inaug, _ = GalleryAlbum.objects.get_or_create(
    title='Inauguration Photos', defaults=dict(icon_class='fas fa-atom', order=3)
)
for i in range(1, 15):
    GalleryPhoto.objects.get_or_create(
        album=inaug, image_url=f'img/inaguration_2/{i}.jpg',
        defaults=dict(alt_text=f'Inauguration Photo {i}', order=i)
    )

# ── Updates ──
Update.objects.get_or_create(
    title='New Data Logging System',
    defaults=dict(
        date_label='October 2025 - Ongoing Project',
        description='Enhanced logging interface with real-time Google sheet integration and cloud backup functionality project started. It is in developmental phase',
    )
)

Update.objects.get_or_create(
    title='Accelerator Inauguration',
    defaults=dict(
        date_label='11th July, 2025',
        description="The inauguration of the 400 keV accelerator took place in the presence of Hon'ble DAE Chairman, Dr. Ajit Mohanty.",
    )
)

print('✅ Database seeded successfully!')