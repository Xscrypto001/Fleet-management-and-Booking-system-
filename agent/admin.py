from django.contrib import admin

from .models import *
admin.site.register(Parcel)
admin.site.register(Driver)
admin.site.register(Bus)
admin.site.register(Vehicle)
admin.site.register(Booking)
admin.site.register(Route)
