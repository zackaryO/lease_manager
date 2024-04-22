from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from .models import Lease, Payment, Lot, LeaseHolder, User, GlobalSettings
import logging

logger = logging.getLogger(__name__)  # Add logging


class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password', 'user_type')

    def validate_password(self, value: str) -> str:
        return make_password(value)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'user_type')
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        # Create a new user with hashed password and set them as an admin
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            user_type=validated_data['user_type'],
            is_staff=True,  # Make user a staff member
            is_superuser=True  # Optionally make user a superuser as well
        )
        return user


class LeaseSerializer(serializers.ModelSerializer):
    # Read-only fields to display nested object information without updating it
    # These fields extract information from related objects (Lot and LeaseHolder) for display purposes
    lot_number = serializers.CharField(source='lot.lot_number', read_only=True)
    lot_address = serializers.CharField(source='lot.lot_address', read_only=True)
    lease_holder_first_name = serializers.CharField(source='lease_holder.lease_holder_first_name', read_only=True)
    lease_holder_last_name = serializers.CharField(source='lease_holder.lease_holder_last_name', read_only=True)
    lease_holder_address = serializers.CharField(source='lease_holder.lease_holder_address', read_only=True)
    email = serializers.EmailField(source='lease_holder.email', read_only=True)
    phone = serializers.CharField(source='lease_holder.phone', read_only=True)

    # PrimaryKeyRelatedField used for updating foreign key references by ID
    # Allows updating of `lot` and `lease_holder` by providing their IDs
    lot = serializers.PrimaryKeyRelatedField(queryset=Lot.objects.all())
    lease_holder = serializers.PrimaryKeyRelatedField(queryset=LeaseHolder.objects.all())

    # FileField for handling file uploads; allow_null=True lets the field be optional
    lease_agreement_path = serializers.FileField(max_length=None, use_url=True, required=False, allow_null=True)
    lot_image_path = serializers.FileField(max_length=None, use_url=True, required=False, allow_null=True)
    payment_status = serializers.CharField(max_length=20, required=False, allow_null=True)

    class Meta:
        # Meta class defines serializer behavior
        model = Lease  # The model associated with this serializer
        fields = '__all__'  # Include all fields from the model in the serializer
        read_only_fields = ['id', 'payment_status',
                            'last_payment_date']  # Fields that cannot be updated via the serializer

    def to_representation(self, instance):
        """Modify the representation of the instance to dynamically calculate payment status."""
        ret = super().to_representation(instance)
        # Dynamically calculate the payment status
        current_payment_status = instance.calculate_current_payment_status()
        ret['payment_status'] = current_payment_status  # Update the payment_status in the response
        return ret

    def update(self, instance, validated_data):
        # Custom update method to handle special cases like file fields
        print("Validated data:", validated_data)  # Logging for debugging

        # Pop file objects from validated_data if they exist; otherwise, get None
        lease_agreement_file = validated_data.pop('lease_agreement_path', None)
        lot_image_file = validated_data.pop('lot_image_path', None)

        # Update instance attributes with the rest of validated_data
        '''
        for attr, value in validated_data.items(): - This line starts a loop over the validated_data dictionary. 
        validated_data.items() returns an iterable of the dictionary's key-value pairs, where attr is the key (name of 
        the attribute or field on the model instance that needs to be updated), and value is the corresponding value for 
        that field.

        setattr(instance, attr, value) - This is a Python built-in function that sets the value of a specified attribute 
        on an object. In this context, instance refers to the model instance being updated (e.g., a specific lease), 
        attr is the name of the attribute to be updated (e.g., 'monthly_rental_amount'), and value is the new value for 
        that attribute. This line effectively updates the instance object with the new data provided by the client.
        '''
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # If file fields were included, save them separately
        if lease_agreement_file is not None:
            instance.lease_agreement_path.save(lease_agreement_file.name, lease_agreement_file, save=False)
        if lot_image_file is not None:
            instance.lot_image_path.save(lot_image_file.name, lot_image_file, save=False)

        instance.save()  # Save changes to the database
        logger.debug(f"Updated lease {instance.id}")  # Log the update action for debugging
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
