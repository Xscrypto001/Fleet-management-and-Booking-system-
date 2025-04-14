from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout

from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .models import Driver, Bus

from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.db.models import Q
from django.contrib import messages
from django.http import JsonResponse
from .models import Parcel, Bus
import uuid
import json
from django.contrib.auth import get_user_model
User = get_user_model()
from .models import Booking


from django.shortcuts import get_object_or_404
from .models import Vehicle

from django.http import JsonResponse
from .models import Route

def bus_routes_view(request):
    routes = Route.objects.select_related('driver').all()
    
    data = [
        {
            "id": str(route.id),
            "route": route.route_name,
            "time": route.time.strftime("%I:%M %p"),
            "driver": route.driver.name if route.driver else "Unassigned",
            "seats": route.available_seats,
            "price": f"${route.price:.2f}",
        }
        for route in routes
    ]
    
    return JsonResponse(data, safe=False)


def bookings_view(request):
    bookings = Booking.objects.select_related('vehicle').all()
    
    data = [
        {
            "id": f"book-{booking.id}",
            "car": {
                "id": str(booking.vehicle.id),
                "name": booking.vehicle.name,
                "type": booking.vehicle.vehicle_type,
                "image": booking.vehicle.image,
                "departureTime": booking.vehicle.departure_time.strftime("%I:%M %p"),
                "arrivalTime": booking.vehicle.arrival_time.strftime("%I:%M %p"),
                "duration": booking.vehicle.duration,
                "from": booking.vehicle.departure_city,
                "to": booking.vehicle.arrival_city,
            },
            "bookingDate": booking.booking_date.strftime("%d %b %Y"),
            "travelDate": booking.travel_date.strftime("%d %b %Y"),
            "seats": booking.seats,
            "totalAmount": float(booking.total_amount),
            "status": booking.status,
        }
        for booking in bookings
    ]
    
    return JsonResponse(data, safe=False)

@login_required
def parcel_list(request):
    """View for displaying and filtering parcels"""
    queryset = Parcel.objects.all()
    
    # Search functionality
    search_query = request.GET.get('search')
    if search_query:
        queryset = queryset.filter(
            Q(tracking_number__icontains=search_query) |
            Q(description__icontains=search_query) |
            Q(sender_name__icontains=search_query) |
            Q(recipient_name__icontains=search_query)
        )
    
    # Filter by status
    status_filter = request.GET.get('status')
    if status_filter:
        queryset = queryset.filter(status=status_filter)
    
    # Sorting
    sort_by = request.GET.get('sort_by', 'created_at')
    sort_order = request.GET.get('sort_order', 'desc')
    
    if sort_by not in ['created_at', 'delivery_date', 'weight', 'amount']:
        sort_by = 'created_at'  # Default sort field
    
    # Apply sort order
    if sort_order == 'asc':
        queryset = queryset.order_by(sort_by)
    else:
        queryset = queryset.order_by(f'-{sort_by}')
    
    # Pagination
    paginator = Paginator(queryset, 10)  # 10 parcels per page
    page_number = request.GET.get('page', 1)
    parcels = paginator.get_page(page_number)
    # Get available buses for the form
    buses = Bus.objects.filter(is_active=True)
    
    context = {
        'parcels': parcels,
        'buses': buses,
        'paystack_public_key': 'pk_live_504e9f8c8aebfa975ff87ba801235867f91f39f9',  # Replace with your actual key
    }
    
    return render(request, 'agent/parcels.html', context)

from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import Parcel, Bus
import uuid

@login_required
def add_parcel(request):
    if request.method == 'POST':
        sender_name = request.POST.get('sender_name')
        sender_phone = request.POST.get('sender_phone')
        recipient_name = request.POST.get('recipient_name')
        recipient_phone = request.POST.get('recipient_phone')
        pickup_location = request.POST.get('pickup_location')
        delivery_location = request.POST.get('delivery_location')
        bus_id = request.POST.get('bus')
        weight = request.POST.get('weight')
        parcel_type = request.POST.get('parcel_type')
        amount = request.POST.get('amount')
        description = request.POST.get('description')
        payment_ref = request.POST.get('payment_reference')

        try:
            bus = Bus.objects.get(id=bus_id)
        except Bus.DoesNotExist:
            messages.error(request, "Invalid bus selection.")
            return redirect('add_parcel')

        parcel = Parcel(
            user=request.user,
            sender_name=sender_name,
            sender_phone=sender_phone,
            recipient_name=recipient_name,
            recipient_phone=recipient_phone,
            pickup_location=pickup_location,
            delivery_location=delivery_location,
            bus=bus,
            weight=weight,
            parcel_type=parcel_type,
            amount=amount,
            description=description,
            tracking_number=f"TRK{uuid.uuid4().hex[:8].upper()}"
        )

        if payment_ref:
            parcel.payment_reference = payment_ref
            parcel.payment_status = 'paid'
        
        parcel.save()
        messages.success(request, f'Parcel with tracking number {parcel.tracking_number} created successfully.')
        return redirect('parcel_list')
    
    return redirect('parcel_list')

@login_required
def parcel_detail(request, pk):
    parcel = get_object_or_404(Parcel, pk=pk, user=request.user)
    return render(request, 'parcel_detail.html', {'parcel': parcel})

def login_view(request):
    if request.user.is_authenticated:
        return redirect('dashboard')
        
    if request.method == 'POST':
            username = request.POST['phone']
            password = request.POST['password']

            
            user = authenticate(username=username, password=password)
            
            if user is not None:
                login(request, user)
                next_url = request.GET.get('next', 'Trips')
                return redirect(next_url)
            else:
                messages.error(request, 'Invalid username or password')
    
    return render(request, 'agent/login.html')

def signup_view(request):
    if request.user.is_authenticated:
        return redirect('dashboard')
        
            
    if request.method == 'POST':
            username = request.POST['phone']
            password = request.POST['password']

            user = User.objects.create_user(username=username, password=password)
            login(request, user)
            messages.success(request, 'Account created successfully!')
            return redirect('parcel_list')

    
    return render(request, 'agent/register.html')

def logout_view(request):
    logout(request)
    messages.info(request, 'You have been logged out successfully.')
    return redirect('login')



@login_required
def drivers_view(request):
    # Fetch drivers from database
    drivers = Driver.objects.all()
    total_drivers = drivers.count()
    context = {
        'drivers': drivers,
        'total_drivers': total_drivers
    }
    return render(request, 'agent/drivers.html', context)

@login_required
def add_driver(request):
    if request.method == 'POST':
        full_name = request.POST.get('fullName')
        phone_number = request.POST.get('phoneNumber')
        email = request.POST.get('email')
        age = request.POST.get('age')
        license_number = request.POST.get('licenseNumber')
        license_expiry = request.POST.get('licenseExpiry')
        experience = request.POST.get('experience')
        status = request.POST.get('status')
        address = request.POST.get('address')
        emergency_contact = request.POST.get('emergencyContact')
        vehicle_preference = request.POST.get('vehiclePreference')
        photo = request.FILES.get('photo')
        
        # Create new Driver object
        driver = Driver(
            name=full_name,
            phone=phone_number,
            email=email,
            age=age,
            license_number=license_number,
            license_expiry=license_expiry,
            experience=experience,
            status=status,
            address=address,
            emergency_contact=emergency_contact,
            vehicle_preference=vehicle_preference,
            photo=photo,
            rating=0  # Default rating for new driver
        )
        driver.save()
        
        messages.success(request, f'Driver {full_name} has been added successfully!')
        return redirect('drivers')
    
    return redirect('drivers')




def Vehicles(request):
    fleet = Bus.objects.all()
    stats = {
        
        'total': Bus.objects.all().count(),
        'acive': Bus.objects.filter(is_active=True).count(),
         'on_maintainance': Bus.objects.filter(on_maintainance=True).count(),
          'reported': Bus.objects.filter(reported=True).count(),
    }
    return render(request, 'agent/fleet_management.html', {'fleet': fleet, ' stats': stats})

def Trips(request):
    return render(request, 'agent/tickets.html')



def car_details_view(request, car_id):
    vehicle = get_object_or_404(Vehicle, id=car_id)

    data = {
        "car": {
            "id": str(vehicle.id),
            "name": vehicle.name,
            "type": vehicle.vehicle_type,
            "image": vehicle.image,
            "rating": vehicle.rating,
            "departureTime": vehicle.departure_time.strftime("%I:%M %p"),
            "arrivalTime": vehicle.arrival_time.strftime("%I:%M %p"),
            "duration": vehicle.duration,
            "from": vehicle.departure_city,
            "to": vehicle.arrival_city,
            "date": vehicle.date.strftime("%d %b %Y"),
            "price": float(vehicle.price),
            "amenities": vehicle.amenities,
            "totalSeats": vehicle.total_seats,
            "availableSeats": vehicle.available_seats,
        }
    }

    return JsonResponse(data)





def bookings_view(request, book_id):
    vehicle = Booking.objects.all()



    data = {
        "vehicle": {
            "vehicle": vehicle,
     
    
        }
    }

    return JsonResponse(data)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User

class UsernamesStringView(APIView):
    permission_classes = [IsAuthenticated]  

    def get(self, request):
        usernames = [user.username for user in User.objects.all()]
        usernames_str = ", ".join(usernames)
        return Response(usernames_str)

class AvailableRoutesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        routes = Route.objects.all()
        data = [
            {
                "id": route.id,
                "name": route.route_name,
                "time": route.time.strftime("%I:%M %p"),
                "seats": route.available_seats,
                "price": f"${route.price:.2f}"
            }
            for route in routes
        ]
        return Response(data)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Booking

class BookingListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        bookings = Booking.objects.filter(user=request.user).order_by('-booking_date')
        data = []

        for b in bookings:
            booking = {
                "id": f"B{b.id:03d}",
                "type": b.type,
                "status": b.status,
                "price": float(b.price),
                "bookingDate": b.booking_date.strftime("%Y-%m-%d"),
                "thumbnail": b.thumbnail,
            }

            if b.type in ["Flight", "Train", "Bus"]:
                booking.update({
                    "origin": b.origin,
                    "destination": b.destination,
                    "departureDate": b.departure_date.strftime("%Y-%m-%d") if b.departure_date else "",
                    "departureTime": b.departure_time,
                    "arrivalTime": b.arrival_time,
                })
                if b.type == "Flight":
                    booking["airline"] = b.airline
                    booking["flightNumber"] = b.flight_number
                elif b.type == "Train":
                    booking["operator"] = b.airline  # reuse airline as operator
                    booking["trainNumber"] = b.train_number
                elif b.type == "Bus":
                    booking["operator"] = b.airline  # reuse airline as operator
                    booking["busNumber"] = b.bus_number

            elif b.type == "Hotel":
                booking.update({
                    "location": b.location,
                    "checkIn": b.check_in.strftime("%Y-%m-%d") if b.check_in else "",
                    "checkOut": b.check_out.strftime("%Y-%m-%d") if b.check_out else "",
                    "hotel": b.hotel,
                    "roomType": b.room_type,
                })

            data.append(booking)

        return Response(data)
# views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Booking

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_booking_as_paid(request, booking_id):
    try:
        booking = Booking.objects.get(id=booking_id, user=request.user)
        booking.is_paid = True
        booking.save()
        return Response({'message': 'Booking marked as paid'}, status=status.HTTP_200_OK)
    except Booking.DoesNotExist:
        return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)



from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Booking

class BookingListView(APIView):
    permission_classes = [IsAuthenticated]  # Ensures the user is authenticated

    def get(self, request):
        # Filter bookings by the logged-in user
        bookings = Booking.objects.filter(user=request.user)  # Filter by the authenticated user
        
        # Manually constructing the response data as a list of dictionaries
        booking_data = [
            {
                'id': booking.id,
                'type': booking.type,
                'origin': booking.origin,
                'destination': booking.destination,
                'departure_date': booking.departure_date,
                'departure_time': booking.departure_time,
                'arrival_time': booking.arrival_time,
                'status': booking.status,
                'price': str(booking.price),  # Convert price to string to ensure JSON compatibility
                'airline': booking.airline,
                'flight_number': booking.flight_number,
                'train_number': booking.train_number,
                'bus_number': booking.bus_number,
                'hotel': booking.hotel,
                'room_type': booking.room_type,
                'booking_date': booking.booking_date,
                'thumbnail': booking.thumbnail,
            }
            for booking in bookings
        ]
        return Response(booking_data)  # Return the manually constructed JSON data
