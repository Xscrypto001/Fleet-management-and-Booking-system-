from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission, BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin


class CustomUserManager(BaseUserManager):
    def create_user(self, phone, password=None, **extra_fields):
        if not phone:
            raise ValueError('The Email field must be set')
        phone = self.normalize_phone(phone)
        user = self.model(phone=phone, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    phone = models.CharField(unique=True, max_length=100)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now=True)
    email_verified = models.DateTimeField(null=True,blank=True)
    USERNAME_FIELD = 'phone'
    REQUIRED_FIELDS = []
    verification_token = models.CharField(max_length=255, blank=True, null=True)
    token_created_at = models.DateTimeField(null=True, blank=True)
    objects = CustomUserManager()

    def __str__(self):
        return self.email





class Drivers(models.Model):
    driver = models.CharField(max_length = 350, null=False)
    image = models.ImageField(upload_to='avatars/', null=True, blank=True)
    trips = models.IntegerField(default=0)
    joined = models.DateTimeField(auto_now_add=True)

class Bus(models.Model):
    driver = models.ForeignKey(Drivers, null=False, on_delete=models.CASCADE)
    number_plate = models.CharField(max_length = 300, null=False)
    seats = models.IntegerField(default=0, null=False)

class Routes(models.Model):
    route = models.CharField(max_length = 300, null=False)



class Trips(models.Model):
   user = models.ForeignKey(CustomUser, null=False, on_delete=models.CASCADE)
   created = models.DateTimeField(auto_now_add=True)
   routes = models.ForeignKey(Routes, null=False, on_delete=models.CASCADE)
   vehicle = models.ForeignKey(Bus, null=False, on_delete=models.CASCADE)


class Tickect(models.Model):
    code = models.CharField(max_length = 300, null=False)
    created = models.DateTimeField(auto_now_add=True)
