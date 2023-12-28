# forms.py
from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm

from .models import LeaseHolder, User, Lease, Lot


class LeaseHolderForm(forms.ModelForm):
    class Meta:
        model = LeaseHolder
        fields = '__all__'


class CustomUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = User
        fields = UserCreationForm.Meta.fields + ('is_staff',)

        class CustomUserChangeForm(UserChangeForm):
            class Meta:
                model = User
                fields = ('username', 'email', 'is_active')


class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = User
        fields = ('username', 'email', 'user_type', 'is_active', 'is_staff')


class LeaseForm(forms.ModelForm):
    class Meta:
        model = Lease
        fields = ['lot', 'lease_holder', 'monthly_rental_amount', 'due_date', 'grace_period', 'lease_agreement_path',
                  'lot_image_path', 'payment_status']


class LotForm(forms.ModelForm):
    class Meta:
        model = Lot
        fields = ['lot_number', 'lot_address', 'occupied']
