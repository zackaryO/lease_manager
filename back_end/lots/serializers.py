from rest_framework import serializers
from .models import Lease, LeaseHolder  # Make sure to import LeaseHolder if it's in a different file

class LeaseSerializer(serializers.ModelSerializer):
    lot_number = serializers.ReadOnlyField(source='lot.lot_number')
    lot_address = serializers.ReadOnlyField(source='lot.lot_address')
    lease_holder_name = serializers.ReadOnlyField(source='lease_holder.lease_holder_name')
    email = serializers.ReadOnlyField(source='lease_holder.email')  # Retrieve email from LeaseHolder
    phone = serializers.ReadOnlyField(source='lease_holder.phone')  # Retrieve phone from LeaseHolder

    # Explicitly define the file fields to ensure they're serialized correctly.
    lease_agreement_path = serializers.FileField(max_length=None, use_url=True)
    lot_image_path = serializers.FileField(max_length=None, use_url=True)

    class Meta:
        model = Lease
        fields = [
            'lot_number', 'lot_address', 'lease_holder_name',
            'email', 'phone',  # Include email and phone in the fields
            'monthly_rental_amount', 'due_date', 'grace_period',
            'lease_agreement_path', 'lot_image_path',  # Include paths to the files
            'payment_status'
        ]
