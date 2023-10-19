from rest_framework import serializers
from .models import Lease, LeaseHolder

class LeaseSerializer(serializers.ModelSerializer):
    lot_number = serializers.CharField(source='lot.lot_number', read_only=True)
    lot_address = serializers.CharField(source='lot.lot_address', read_only=True)
    lease_holder_name = serializers.CharField(source='lease_holder.lease_holder_name', read_only=True)
    email = serializers.EmailField(source='lease_holder.email', read_only=True)
    phone = serializers.CharField(source='lease_holder.phone', read_only=True)

    # Explicitly define the file fields to ensure they're serialized correctly.
    lease_agreement_path = serializers.FileField(max_length=None, use_url=True, required=False)
    lot_image_path = serializers.FileField(max_length=None, use_url=True, required=False)

    class Meta:
        model = Lease
        fields = [
            'id',  # Add 'id' field here
            'lot_number', 'lot_address', 'lease_holder_name',
            'email', 'phone',
            'monthly_rental_amount', 'due_date', 'grace_period',
            'lease_agreement_path', 'lot_image_path',
            'payment_status'
        ]
        read_only_fields = ['payment_status']  # if 'payment_status' is not supposed to be updated directly

    def update(self, instance, validated_data):
        # Custom update logic if needed
        # For example, you can handle nested objects or other complex behaviors

        lease_holder_data = validated_data.pop('lease_holder', None)
        lot_data = validated_data.pop('lot', None)

        # Normal DRF update on the main object
        super().update(instance, validated_data)

        # If related lease_holder data was sent in the request, update the LeaseHolder object
        if lease_holder_data:
            lease_holder = instance.lease_holder
            for attr, value in lease_holder_data.items():
                setattr(lease_holder, attr, value)
            lease_holder.save()

        # If related lot data was sent in the request, update the Lot object
        if lot_data:
            lot = instance.lot
            for attr, value in lot_data.items():
                setattr(lot, attr, value)
            lot.save()

        return instance
