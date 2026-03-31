from django.core.management.base import BaseCommand
from fields.models import Field

SAMPLE_FIELDS = [
    {
        "name": "North Pivot",
        "current_soil_moisture": 0.17,
        "stress_threshold": 0.18,
        "ideal_soil_moisture": 0.24,
    },
    {
        "name": "East Field",
        "current_soil_moisture": 0.22,
        "stress_threshold": 0.18,
        "ideal_soil_moisture": 0.24,
    },
    {
        "name": "South Block",
        "current_soil_moisture": 0.19,
        "stress_threshold": 0.18,
        "ideal_soil_moisture": 0.24,
    },
]


class Command(BaseCommand):
    help = "Seeds the database with sample field data. Safe to run multiple times."

    def handle(self, *args, **kwargs):
        for data in SAMPLE_FIELDS:
            obj, created = Field.objects.get_or_create(
                name=data["name"],
                defaults={
                    "current_soil_moisture": data["current_soil_moisture"],
                    "stress_threshold": data["stress_threshold"],
                    "ideal_soil_moisture": data["ideal_soil_moisture"],
                },
            )
            status = "Created" if created else "Already exists"
            self.stdout.write(f"  {status}: {obj.name}")

        self.stdout.write(self.style.SUCCESS("Seeding complete."))