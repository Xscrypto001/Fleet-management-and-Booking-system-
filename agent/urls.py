from django.urls import path
from . import views
from .views import UsernamesView,AvailableRoutesView,BookingListView

urlpatterns = [
    path('parcel/', views.parcel_list, name='parcel_list'),
    path('add/', views.add_parcel, name='add_parcel'),
    path('parcel/<int:pk>/', views.parcel_detail, name='parcel_detail'),
    path("api/bookings/<int:booking_id>/mark-paid/", mark_booking_as_paid, name="mark-booking-paid"),
   path('api/history/', BookingListView.as_view(), name='booking-list'),
    path('parcel/<int:pk>/', views.parcel_detail, name='parcel_detail'),
    path('login/', views.login_view, name='login'),
    path('signup/', views.signup_view, name='signup'),
    path('logout/', views.logout_view, name='logout'),
    path('drivers/', views.drivers_view, name='drivers'),
    path('drivers/add/', views.add_driver, name='add_driver'),
    path('', views.Trips, name='Trips'),
    path('vehicles/', views.Vehicles, name='vehicles'),
      path("bookings/", views.bookings_view, name="bookings"),
    path("routes/", views.bus_routes_view, name="bus_routes"),
    path('api/usernames/', UsernamesView.as_view(), name='usernames'),
    path('api/routes/', AvailableRoutesView.as_view(), name='available-routes'),
 path('api/bookings/', BookingListView.as_view(), name='bookings-list'),
    path("car/<int:car_id>/", views.car_details_view, name="car_details"),
]
