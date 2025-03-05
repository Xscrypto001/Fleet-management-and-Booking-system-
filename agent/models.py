from django.db import models
from django.contrib.auth.models import User
import uuid

class Parcel(models.Model):
    PENDING = 'pending'
    IN_TRANSIT = 'in_transit'
    DELIVERED = 'delivered'
    STATUS_CHOICES = [
        (PENDING, 'Pending'),
        (IN_TRANSIT, 'In Transit'),
        (DELIVERED, 'Delivered'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    tracking_number = models.CharField(max_length=20, unique=True, blank=True)
    description = models.TextField()
    sender_name = models.CharField(max_length=255)
    recipient_name = models.CharField(max_length=255)
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default=PENDING)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    weight = models.DecimalField(max_digits=5, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    delivery_date = models.DateTimeField(null=True, blank=True)
    payment_reference = models.CharField(max_length=100, blank=True, null=True)
    payment_status = models.CharField(max_length=20, blank=True, null=True)
    
    def save(self, *args, **kwargs):
        if not self.tracking_number:
            self.tracking_number = f"TRK{uuid.uuid4().hex[:8].upper()}"
        super(Parcel, self).save(*args, **kwargs)

    def __str__(self):
        return self.tracking_number


class Driver(models.Model):
    ACTIVE = 'active'
    INACTIVE = 'inactive'
    STATUS_CHOICES = [
        (ACTIVE, 'Active'),
        (INACTIVE, 'Inactive'),
    ]

    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20, unique=True)
    email = models.EmailField()
    age = models.IntegerField()
    license_number = models.CharField(max_length=20)
    license_expiry = models.DateField()
    experience = models.IntegerField()  # In years
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default=ACTIVE)
    address = models.TextField()
    emergency_contact = models.CharField(max_length=20)
    vehicle_preference = models.CharField(max_length=255)
    photo = models.ImageField(upload_to='drivers/', null=True, blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)

    def __str__(self):
        return self.name


class Bus(models.Model):
    is_active = models.BooleanField(default=True)
    bus_number = models.CharField(max_length=20)
    driver = models.ForeignKey(Driver, on_delete=models.SET_NULL, null=True)
    
    def __str__(self):
        return self.bus_number
