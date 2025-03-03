from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class Driver(models.Model):
    STATUS_CHOICES = (
        ('available', 'Available'),
        ('on_trip', 'On Trip'),
        ('on_leave', 'On Leave'),
    )
    
    VEHICLE_PREFERENCE = (
        ('bus', 'Bus'),
        ('minibus', 'Minibus'),
        ('van', 'Van'),
        ('', 'No Preference'),
    )
    
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True, null=True)
    age = models.PositiveIntegerField(validators=[MinValueValidator(18), MaxValueValidator(70)])
    license_number = models.CharField(max_length=50, unique=True)
    license_expiry = models.DateField()
    experience = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    rating = models.FloatField(default=0, validators=[MinValueValidator(0), MaxValueValidator(5)])
    address = models.TextField(blank=True, null=True)
    emergency_contact = models.CharField(max_length=20, blank=True, null=True)
    vehicle_preference = models.CharField(max_length=10, choices=VEHICLE_PREFERENCE, blank=True)
    photo = models.ImageField(upload_to='driver_photos/', blank=True, null=True)
    date_joined = models.DateField(auto_now_add=True)
    
    def __str__(self):
        return self.name
