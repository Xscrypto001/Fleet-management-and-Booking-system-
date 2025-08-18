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
    email = models.EmailField(null=True)
    age = models.IntegerField(null=True)
    license_number = models.CharField(max_length=20, null=True)
    license_expiry = models.DateField(null=True)
    experience = models.IntegerField(null=True)  # In years
    status = models.CharField( max_length=20, choices=STATUS_CHOICES, default=ACTIVE, null=True)
    address = models.TextField(null=True)
    emergency_contact = models.CharField(max_length=20, null=True)
    vehicle_preference = models.CharField(max_length=255, null=True)
   # photo = models.ImageField(upload_to='drivers/', null=True, blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0, null=True)

    def __str__(self):
        return self.name


class Bus(models.Model):
    is_active = models.BooleanField(default=True,null=True)
    bus_number = models.CharField(max_length=20,null=True)
    license = models.CharField(max_length=20,null=True)
    on_maintainance = models.BooleanField(default=False,null=True) 
    reported = models.BooleanField(default=False,null=True) 
    driver = models.ForeignKey(Driver, on_delete=models.SET_NULL, null=True)
    last_service = models.DateTimeField(null=True)
    def __str__(self):
        return self.bus_number

class Route(models.Model):
    bus = models.ForeignKey('Bus', on_delete=models.CASCADE, related_name="routes")
    driver = models.ForeignKey('Driver', on_delete=models.SET_NULL, null=True, related_name="routes")
    route_name = models.CharField(max_length=255)
    time = models.TimeField()
    available_seats = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=6, decimal_places=2)

    def __str__(self):
        return f"{self.route_name} - {self.time.strftime('%I:%M %p')}"




from django.db import models

from django.db import models

class Vehicle(models.Model):
    name = models.CharField(max_length=255)
    vehicle_type = models.CharField(max_length=100)
    image = models.URLField()
    rating = models.FloatField()
    departure_time = models.TimeField()
    arrival_time = models.TimeField()
    duration = models.CharField(max_length=50)
    departure_city = models.CharField(max_length=100)
    arrival_city = models.CharField(max_length=100)
    date = models.DateField()
    price = models.DecimalField(max_digits=6, decimal_places=2)
    amenities = models.JSONField()  # List of amenities
    total_seats = models.IntegerField()
    available_seats = models.IntegerField()

    def __str__(self):
        return self.name



class Booking(models.Model):
    BOOKING_TYPES = [
        ('Flight', 'Flight'),
        ('Train', 'Train'),
        ('Bus', 'Bus'),
        ('Hotel', 'Hotel'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    type = models.CharField(max_length=20, choices=BOOKING_TYPES, null=True)
    origin = models.CharField(max_length=100, blank=True, null=True)
    destination = models.CharField(max_length=100, blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    departure_date = models.DateField(blank=True, null=True)
    departure_time = models.CharField(max_length=20, blank=True, null=True)
    arrival_time = models.CharField(max_length=20, blank=True, null=True)
    check_in = models.DateField(blank=True, null=True)
    check_out = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=20, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    airline = models.CharField(max_length=100, blank=True, null=True)
    flight_number = models.CharField(max_length=50, blank=True, null=True)
    train_number = models.CharField(max_length=50, blank=True, null=True)
    bus_number = models.CharField(max_length=50, blank=True, null=True)
    hotel = models.CharField(max_length=100, blank=True, null=True)
    room_type = models.CharField(max_length=100, blank=True, null=True)
    booking_date = models.DateField(null=True)
    thumbnail = models.URLField(default="/api/placeholder/80/80", null=True)
    
    def __str__(self):
        return f"{self.type} booking - {self.id}"
