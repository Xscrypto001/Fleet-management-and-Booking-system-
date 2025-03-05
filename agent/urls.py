from django.urls import path
from . import views

urlpatterns = [
    path('parcel/', views.parcel_list, name='parcel_list'),
    path('add/', views.add_parcel, name='add_parcel'),
    path('parcel/<int:pk>/', views.parcel_detail, name='parcel_detail'),
    path('login/', views.login_view, name='login'),
    path('signup/', views.signup_view, name='signup'),
    path('logout/', views.logout_view, name='logout'),
    path('drivers/', views.drivers_view, name='drivers'),
    path('drivers/add/', views.add_driver, name='add_driver'),
]
