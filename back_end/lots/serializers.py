from rest_framework import serializers
from .models import Lease, Lot, LeaseHolder


class LeaseSerializer(serializers.ModelSerializer):
    lot_number = serializers.ReadOnlyField(source='lot.lot_number')
    lot_address = serializers.ReadOnlyField(source='lot.lot_address')
    lease_holder_name = serializers.ReadOnlyField(source='lease_holder.lease_holder_name')

    class Meta:
        model = Lease
        fields = ['lot_number', 'lot_address', 'lease_holder_name', 'monthly_rental_amount', 'due_date', 'grace_period',
                  'payment_status']
