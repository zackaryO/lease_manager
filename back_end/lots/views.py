from django.contrib import messages
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.contrib.auth.views import LoginView
from django.http import HttpResponseRedirect, HttpResponseForbidden
from django.shortcuts import redirect, render, get_object_or_404, resolve_url
from django.urls import reverse_lazy
from django.views.generic import ListView, UpdateView, DeleteView
from rest_framework import generics, status
from rest_framework.generics import ListAPIView, RetrieveUpdateAPIView
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from .forms import LeaseHolderForm, CustomUserCreationForm, LeaseForm, LotForm
from .permissions import IsAdminUser, IsStaffUser
from .models import Lease, Payment, Lot, User, LeaseHolder
from .serializers import LeaseSerializer, PaymentSerializer, LotSerializer, UserRegistrationSerializer, \
    LeaseHolderSerializer


class UserRegistrationAPIView(generics.CreateAPIView):
    """
    API view for user registration.
    Only accessible to admin users.
    """
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminUser]  # Accessible only to admin users

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user": UserRegistrationSerializer(user).data
        }, status=status.HTTP_201_CREATED)


class LeaseListView(ListAPIView):
    """
    API view to retrieve a list of leases.
    Uses JWT for authentication and allows access only to authenticated users.
    """
    queryset = Lease.objects.all()
    serializer_class = LeaseSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsStaffUser]


class LeaseHolderView(ListAPIView):
    """
    API view to retrieve a list of leases.
    Uses JWT for authentication and allows access only to authenticated users.
    """
    queryset = LeaseHolder.objects.all()
    serializer_class = LeaseHolderSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsStaffUser]


class LeaseDetailUpdateView(RetrieveUpdateAPIView):
    """
    API view to retrieve and update a lease instance.
    Uses JWT for authentication and allows access only to authenticated users.
    """
    queryset = Lease.objects.all()
    serializer_class = LeaseSerializer
    lookup_field = 'id'
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsStaffUser]


class PaymentListCreateView(generics.ListCreateAPIView):
    """
    API view to list and create payments.
    Filters out any payments marked as deleted.
    Uses JWT for authentication and allows access only to authenticated users.
    """
    queryset = Payment.objects.filter(is_deleted=False)
    serializer_class = PaymentSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsStaffUser]


class PaymentBulkDeleteView(APIView):
    """
    API view to delete multiple payments.
    Accepts a POST request with a list of payment IDs and marks them as deleted.
    Uses JWT for authentication and allows access only to authenticated users.
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminUser]

    def post(self, request, *args, **kwargs):
        payment_ids = request.data.get('ids', [])
        payments = Payment.objects.filter(id__in=payment_ids)
        payments.update(is_deleted=True)
        return Response({'status': 'payments successfully deleted'}, status=status.HTTP_200_OK)


class LotListView(ListAPIView):
    """
    API view to list all lots.
    Uses JWT for authentication and allows access only to authenticated users.
    """
    queryset = Lot.objects.all()
    serializer_class = LotSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsStaffUser]


class UnoccupiedLotListView(ListAPIView):
    """
    API view to list all unoccupied lots.
    Filters the lots to only include those that are not occupied.
    Uses JWT for authentication and allows access only to authenticated users.
    """
    queryset = Lot.objects.filter(occupied=False)
    serializer_class = LotSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsStaffUser]


class LeaseCreateView(generics.CreateAPIView):
    """
    API view to create a new lease.
    Uses JWT for authentication and allows access only to authenticated users.
    """
    queryset = Lease.objects.all()
    serializer_class = LeaseSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsStaffUser]


def add_lease_holder(request):
    if request.method == 'POST':
        form = LeaseHolderForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect(reverse('lease_holder_list'))  # Replace with your desired redirect view
    else:
        form = LeaseHolderForm()
    return render(request, 'lots/add_lease_holder.html', {'form': form})


def lease_holder_detail(request, lease_holder_id):
    lease_holder = get_object_or_404(LeaseHolder, id=lease_holder_id)
    return render(request, 'lots/lease_holder_detail.html', {'lease_holder': lease_holder})


def edit_lease_holder(request, lease_holder_id):
    lease_holder = get_object_or_404(LeaseHolder, id=lease_holder_id)

    if request.method == 'POST':
        form = LeaseHolderForm(request.POST, instance=lease_holder)
        if form.is_valid():
            form.save()
            return redirect('lease_holder_detail', lease_holder_id=lease_holder_id)
    else:
        form = LeaseHolderForm(instance=lease_holder)

    return render(request, 'lots/edit_lease_holder.html', {'form': form, 'lease_holder': lease_holder})


def delete_lease_holder(request, lease_holder_id):
    lease_holder = get_object_or_404(LeaseHolder, id=lease_holder_id)

    if request.method == 'POST':
        lease_holder.delete()
        return redirect('lease_holder_list')  # Redirect to the lease holder list

    return render(request, 'lots/delete_lease_holder.html', {'lease_holder': lease_holder})


class LeaseHolderListView(ListView):
    model = LeaseHolder
    template_name = 'lots/lease_holder_list.html'
    context_object_name = 'lease_holders'


def lease_back_list(request):
    leases = Lease.objects.all()
    return render(request, 'lots/lease_back_list.html', {'leases': leases})


def lease_create(request):
    form = LeaseForm(request.POST or None, request.FILES or None)
    if form.is_valid():
        form.save()
        return redirect('lease_back_list')
    return render(request, 'lots/lease_create.html', {'form': form})


def lease_update(request, lease_id):  # lease_id matches the URL pattern
    lease = get_object_or_404(Lease, pk=lease_id)
    if request.method == "POST":
        form = LeaseForm(request.POST, instance=lease)
        if form.is_valid():
            form.save()
            return redirect('lease_back_list')
    else:
        form = LeaseForm(instance=lease)
    return render(request, 'lots/lease_update.html', {'form': form})


def delete_lease_back(request, lease_id):
    lease = get_object_or_404(Lease, pk=lease_id)  # Corrected to fetch Lease by primary key

    if request.method == 'POST':
        lease.delete()
        return redirect('lease_back_list')  # Make sure 'lease_back_list' is the correct URL pattern name

    return render(request, 'lots/delete_lease_back.html', {'object': lease})


def lease_back_detail(request, lease_holder_id):
    lease_holder = get_object_or_404(LeaseHolder, id=lease_holder_id)
    return render(request, 'lots/lease_back_detail.html', {'lease_holder': lease_holder})


def is_staff_or_admin(user):
    return user.is_staff or user.is_superuser


@login_required
@user_passes_test(is_staff_or_admin)
def create_user(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            new_user = form.save(commit=False)
            # Restrict staff from creating admin users
            if not request.user.is_superuser and new_user.is_superuser:
                form.add_error(None, 'You do not have permission to create an admin user.')
            else:
                new_user.save()
                return redirect('user_list')  # Redirect to the user list or another appropriate page
    else:
        form = CustomUserCreationForm()
        if not request.user.is_superuser:
            # Remove 'is_superuser' field for non-admin users
            del form.fields['is_superuser']
    return render(request, 'lots/create_user.html', {'form': form})


class UserListView(LoginRequiredMixin, UserPassesTestMixin, ListView):
    model = User
    template_name = 'lots/user_list.html'
    context_object_name = 'users'

    def test_func(self):
        return self.request.user.is_staff or self.request.user.is_superuser


class CustomUserChangeForm:
    pass


class UserUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    model = User
    form_class = CustomUserChangeForm
    template_name = 'lots/user_update.html'
    success_url = reverse_lazy('lots/user_list')

    def test_func(self):
        return self.request.user.is_staff or self.request.user.is_superuser


class UserDeleteView(LoginRequiredMixin, UserPassesTestMixin, DeleteView):
    model = User
    template_name = 'lots/user_confirm_delete.html'
    success_url = reverse_lazy('user_list')

    def test_func(self):
        # Get the user object being deleted
        user = self.get_object()

        # Check if the user requesting the delete is staff or superuser and the user to be deleted is not a superuser
        return (self.request.user.is_staff or self.request.user.is_superuser) and not user.is_superuser

    def handle_no_permission(self):
        # If the test_func fails, prevent access
        return HttpResponseForbidden("You do not have permission to delete this user.")


def lot_list(request):
    lots = Lot.objects.all()
    return render(request, 'lots/lot_list.html', {'lots': lots})


def lot_create(request):
    form = LotForm(request.POST or None)
    if form.is_valid():
        form.save()
        return redirect('lot_list')
    return render(request, 'lots/lot_form.html', {'form': form})


def lot_update(request, pk):
    lot = get_object_or_404(Lot, pk=pk)
    form = LotForm(request.POST or None, instance=lot)
    if form.is_valid():
        form.save()
        return redirect('lot_list')
    return render(request, 'lots/lot_form.html', {'form': form})


def lot_delete(request, pk):
    lot = get_object_or_404(Lot, pk=pk)
    if request.method == 'POST':
        lot.delete()
        return redirect('lot_list')
    return render(request, 'lots/lot_confirm_delete.html', {'object': lot})


class CustomLoginView(LoginView):
    template_name = 'lots/login.html'

    def get_redirect_url(self):
        url = super().get_redirect_url()
        if self.request.user.is_authenticated:
            if self.request.user.user_type == 1:  # Staff
                return resolve_url('lease_back_list')
            # elif self.request.user.user_type == 2:  # Customer
            #     return resolve_url('customer_dashboard')
        return url or resolve_url('lease_back_list')
