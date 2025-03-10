from django.contrib import admin

from .models import Bus,Driver,Parcel
admin.site.register(Parcel)
admin.site.register(Driver)
admin.site.register(Bus)