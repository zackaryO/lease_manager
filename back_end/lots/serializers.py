from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from .models import Lease, Payment, Lot, LeaseHolder, User, GlobalSettings


class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password', 'user_type')

    def validate_password(self, value: str) -> str:
        return make_password(value)


class LeaseSerializer(serializers.ModelSerializer):
    lot_number = serializers.CharField(source='lot.lot_number')
    lot_address = serializers.CharField(source='lot.lot_address')
    lease_holder_first_name = serializers.CharField(source='lease_holder.lease_holder_first_name')
    lease_holder_last_name = serializers.CharField(source='lease_holder.lease_holder_last_name')
    lease_holder_address = serializers.CharField(source='lease_holder.lease_holder_address')
    email = serializers.EmailField(source='lease_holder.email', )
    phone = serializers.CharField(source='lease_holder.phone')

    # Explicitly define the file fields to ensure they're serialized correctly.
    lease_agreement_path = serializers.FileField(max_length=None, use_url=True, required=False)
    lot_image_path = serializers.FileField(max_length=None, use_url=True, required=False)
    last_payment_date = serializers.DateField(read_only=True)

    class Meta:
        model = Lease
        fields = '__all__'  # Include all fields for updating
        read_only_fields = ['id', 'payment_status']  # Add any fields you want to keep read-only

    def update(self, instance, validated_data):
        # Custom update logic if needed
        # For example, you can handle nested objects or other complex behaviors

        lease_holder_data = validated_data.pop('lease_holder', None)
        lot_data = validated_data.pop('lot', None)

        # Update the instance fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # Save the instance
        instance.save()

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


class LeaseCreateSerializer(serializers.ModelSerializer):
    lot = serializers.PrimaryKeyRelatedField(queryset=Lot.objects.all())
    lease_holder = serializers.PrimaryKeyRelatedField(queryset=LeaseHolder.objects.all())
    lease_agreement_path = serializers.FileField(max_length=None, use_url=True, required=False)
    lot_image_path = serializers.FileField(max_length=None, use_url=True, required=False)

    class Meta:
        model = Lease
        fields = [
            'lot', 'lease_holder', 'monthly_rental_amount', 'due_date', 'grace_period',
            'lease_agreement_path', 'lot_image_path', 'payment_status'
        ]
        extra_kwargs = {
            'due_date': {'default': 1},
            'grace_period': {'default': 5}
        }

    def create(self, validated_data):
        # Handle creation logic, including file saving if necessary
        return super().create(validated_data)


class PaymentSerializer(serializers.ModelSerializer):
    payment_method_display = serializers.CharField(source='get_payment_method_display', read_only=True)
    lease_holder_info = serializers.SerializerMethodField()

    class Meta:
        model = Payment
        fields = [
            'id', 'lease', 'payment_date', 'payment_amount', 'payment_method', 'payment_method_display',
            'transaction_id', 'notes', 'receipt', 'created_at', 'updated_at', 'is_deleted',
            'lease_holder_info',  # Add this line to include the new field in the serialized output
        ]

    def get_lease_holder_info(self, obj):
        # Assuming lease_holder is related to Lease via a foreign key
        lease_holder = obj.lease.lease_holder
        # Utilize a hypothetical simple serializer or just return the required information directly
        lease_holder_data = {
            "lease_holder_first_name": lease_holder.lease_holder_first_name,
            "lease_holder_last_name": lease_holder.lease_holder_last_name
        }
        return lease_holder_data


class LotSerializer(serializers.ModelSerializer):
    """
    Serializer for the Lot model.
    Inherits from serializers.ModelSerializer.
    """

    class Meta:
        model = Lot
        fields = '__all__'

        # extra_kwargs allows you to specify additional details for each field
        # Here, 'required': False is set for the fields that should be optional in a partial update
        extra_kwargs = {
            'lot_number': {'required': False},
            'lot_address': {'required': False},
            # Add similar lines for other fields that should be optional
        }


class LeaseHolderSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaseHolder
        fields = '__all__'
        # extra_kwargs allows you to specify additional details for each field
        # Here, 'required': False is set for the fields that should be optional in a partial update
        extra_kwargs = {
            'lease_holder_first_name': {'required': False},
            'lease_holder_last_name': {'required': False},
            'lease_holder_address': {'required': False},
            'email': {'required': False},
            'phone': {'required': False},
            # Add similar lines for other fields that should be optional
        }


class GlobalSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = GlobalSettings
        fields = '__all__'
