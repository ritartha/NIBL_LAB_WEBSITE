"""
Populate the database with initial NIBL lab data.
Usage:  python manage.py seed_data
"""
from django.core.management.base import BaseCommand
from api.models import Member, Update, ResearchArea


class Command(BaseCommand):
    help = 'Seeds database with initial NIBL lab data'

    def handle(self, *args, **options):

        # ── Members ──────────────────────────────────────────
        members_data = [
            {
                'name': 'Dr. Pratap Kumar Sahoo',
                'role': 'associate_professor',
                'designation': 'Associate Professor',
                'experience_years': 24,
                'description': (
                    'Leading the NIBL research team with expertise in nuclear '
                    'physics and accelerator technology. Driving innovative '
                    'research and fostering collaborations in the scientific community.'
                ),
                'email': 'pratap.sahoo@niser.ac.in',
                'display_order': 1,
            },
            {
                'name': 'Dr. Haraprasanna Lenka',
                'role': 'scientific_officer',
                'designation': 'Scientific Officer - E',
                'experience_years': 24,
                'description': (
                    'Expert in accelerator operations, beam tuning, and safety '
                    'protocols. Ensuring optimal system performance and '
                    'maintaining highest safety standards.'
                ),
                'email': 'hpl@niser.ac.in',
                'display_order': 2,
            },
            {
                'name': 'Dr. Kalyan Ghosh',
                'role': 'post_doc',
                'designation': 'Post Doctoral Researcher',
                'experience_years': 8,
                'description': (
                    'Specialized in nuclear instrumentation development and '
                    'beam diagnostic systems. Expert in advanced measurement '
                    'techniques and system optimization.'
                ),
                'email': 'kalyan.ghosh@niser.ac.in',
                'display_order': 3,
            },
            {
                'name': 'Mr. Ritartha Chaki',
                'role': 'project_associate',
                'designation': 'Project Associate - II',
                'experience_years': 3,
                'description': (
                    'Responsible for laboratory automation, data acquisition '
                    'systems, and innovative solutions. Developing cutting-edge '
                    'software and hardware integration systems.'
                ),
                'email': 'ritartha@niser.ac.in',
                'linkedin_url': 'https://www.linkedin.com/in/ritartha-chaki-bab62ba8/',
                'github_url': 'https://github.com/ritartha',
                'display_order': 4,
            },
        ]

        for m in members_data:
            obj, created = Member.objects.update_or_create(
                email=m['email'], defaults=m
            )
            status = 'CREATED' if created else 'UPDATED'
            self.stdout.write(f'  {status}: {obj.name}')

        self.stdout.write(self.style.SUCCESS(
            f'✓ {len(members_data)} members seeded'
        ))

        # ── Updates ──────────────────────────────────────────
        updates_data = [
            {
                'title': 'New Data Logging System',
                'description': (
                    'Enhanced logging interface with real-time Google sheet '
                    'integration and cloud backup functionality project started. '
                    'It is in developmental phase.'
                ),
                'date_label': 'October 2025 - Ongoing Project',
                'display_order': 1,
            },
            {
                'title': 'Accelerator Inauguration',
                'description': (
                    "The inauguration of the 400 keV accelerator took place "
                    "in the presence of Hon'ble DAE Chairman, Dr. Ajit Mohanty."
                ),
                'date_label': '11th July, 2025',
                'display_order': 2,
            },
        ]

        for u in updates_data:
            obj, created = Update.objects.update_or_create(
                title=u['title'], defaults=u
            )
            status = 'CREATED' if created else 'UPDATED'
            self.stdout.write(f'  {status}: {obj.title}')

        self.stdout.write(self.style.SUCCESS(
            f'✓ {len(updates_data)} updates seeded'
        ))

        # ── Research Areas ───────────────────────────────────
        areas_data = [
            {
                'title': 'Ion Beam Physics',
                'description': 'Advanced studies in ion-matter interactions, beam dynamics, and particle acceleration physics.',
                'icon_class': 'fas fa-atom',
                'display_order': 1,
            },
            {
                'title': 'Nuclear Instrumentation',
                'description': 'Development of innovative detection systems, measurement techniques, and diagnostic tools.',
                'icon_class': 'fas fa-microchip',
                'display_order': 2,
            },
            {
                'title': 'Accelerator Technology',
                'description': 'Research in beam acceleration methods, system optimization, and performance enhancement.',
                'icon_class': 'fas fa-cogs',
                'display_order': 3,
            },
            {
                'title': 'Materials Analysis',
                'description': 'Ion beam analysis for material characterization, surface modification, and thin film studies.',
                'icon_class': 'fas fa-flask',
                'display_order': 4,
            },
        ]

        for a in areas_data:
            obj, created = ResearchArea.objects.update_or_create(
                title=a['title'], defaults=a
            )
            status = 'CREATED' if created else 'UPDATED'
            self.stdout.write(f'  {status}: {obj.title}')

        self.stdout.write(self.style.SUCCESS(
            f'✓ {len(areas_data)} research areas seeded'
        ))

        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS('🎉 All data seeded successfully!'))