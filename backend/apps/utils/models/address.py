from django.db import models

class Address(models.Model):
    """A reusable address model for multiple entities."""
    street = models.CharField(max_length=255, null=True, blank=True)
    street2 = models.CharField(max_length=255, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    state = models.CharField(max_length=100, null=True, blank=True)
    zip_code = models.CharField(max_length=20, null=True, blank=True)
    country = models.CharField(max_length=100, default="Kuwait")

    def __str__(self):
        return f"{self.street}, {self.city}, {self.country}"
