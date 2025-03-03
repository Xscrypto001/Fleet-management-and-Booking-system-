from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout

from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .models import Driver

from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.db.models import Q
from django.contrib import messages
from django.http import JsonResponse
from .models import Parcel, Bus
import uuid
import json
from django.contrib.auth.models import get_user_model 

User = get_user_model()
@login_required
def parcel_list(request):
    """View for displaying and filtering parcels"""
    queryset = Parcel.objects.filter(user=request.user)
    
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
        'paystack_public_key': 'pk_test_your_paystack_public_key_here',  # Replace with your actual key
    }
    
    return render(request, 'parcels.html', context)

@login_required
def add_parcel(request):
    """View for adding a new parcel"""
    if request.method == 'POST':
        form = ParcelForm(request.POST)
        if form.is_valid():
            parcel = form.save(commit=False)
            parcel.user = request.user
            
            # Generate tracking number
            parcel.tracking_number = f"TRK{uuid.uuid4().hex[:8].upper()}"
            
            # Get payment reference if payment was made
            payment_ref = request.POST.get('payment_reference')
            if payment_ref:
                parcel.payment_reference = payment_ref
                parcel.payment_status = 'paid'
            
            parcel.save()
            messages.success(request, f'Parcel with tracking number {parcel.tracking_number} created successfully.')
            return redirect('parcel_list')
        else:
            messages.error(request, 'There was an error with your submission. Please check the form.')
    
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

            
            user = authenticate(phone=username, password=password)
            
            if user is not None:
                login(request, user)
                next_url = request.GET.get('next', 'dashboard')
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

            user = User.objects.create_user(phone=username, password=password)
            login(request, user)
            messages.success(request, 'Account created successfully!')
            return redirect('dashboard')

    
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