from django.db import models


class Field(models.Model):
    name = models.CharField(max_length=255)
    current_soil_moisture = models.FloatField(
        help_text="Current volumetric water content (m³/m³)"
    )
    stress_threshold = models.FloatField(
        help_text="Management Allowable Depletion threshold — below this, crop is under water stress"
    )
    ideal_soil_moisture = models.FloatField(
        help_text="Target soil moisture at field capacity — irrigation refills toward this value"
    )
    # geometry column intentionally omitted for this exercise but
    # this model is designed to support a PostGIS geometry field
    # (e.g. PolygonField) for farm boundary overlays in production.

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name