from django.core.validators import MaxValueValidator
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    USER_TYPE_CHOICES = (
        (1, 'staff'),
        (2, 'customer'),
    )

    user_type = models.PositiveSmallIntegerField(choices=USER_TYPE_CHOICES, help_text="The type of user (staff or customer)")


class Lot(models.Model):
    lot_number = models.IntegerField(unique=True, help_text="Unique number identifying the lot")
    lot_address = models.CharField(max_length=300, help_text="Address of the lot")
    occupied = models.BooleanField(default=False, help_text="Flag to indicate if the lot is currently occupied")

    def __str__(self):
        return f"{self.lot_number} : {self.lot_address}\n"


class LeaseHolder(models.Model):
    lease_holder_first_name = models.CharField(max_length=200, help_text="First name of the lease holder")
    lease_holder_last_name = models.CharField(max_length=200, help_text="Last name of the lease holder")
    lease_holder_address = models.CharField(max_length=200, help_text="Address of the lease holder")
    email = models.CharField(max_length=200, help_text="Email address of the lease holder")
    phone = models.CharField(max_length=200, help_text="Phone number of the lease holder")

    def __str__(self):
        return f"{self.lease_holder_first_name} : {self.lease_holder_last_name}\n"


class Lease(models.Model):
    UP_TO_DATE = 'up-to-date'
    LATE = 'late'
    DELINQUENT = 'delinquent'

    PAYMENT_STATUS_CHOICES = [
        (UP_TO_DATE, 'Up to date'),
        (LATE, 'Late'),
        (DELINQUENT, 'Delinquent'),
    ]

    lot = models.ForeignKey(Lot, on_delete=models.CASCADE, help_text="The lot associated with the lease")
    lease_holder = models.ForeignKey(LeaseHolder, on_delete=models.PROTECT, help_text="The lease holder associated with this lease")
    last_payment_date = models.DateField(null=True, blank=True, help_text="Date of the most recent payment")
    last_payment_date_id = models.ForeignKey('Payment', on_delete=models.SET_NULL, null=True, blank=True, related_name='last_payment_for_lease', help_text="ID of the most recent payment")
    monthly_rental_amount = models.IntegerField(help_text="Monthly rental amount for the lease")
    due_date = models.PositiveSmallIntegerField(validators=[MaxValueValidator(30)], help_text="Due date for monthly payments")
    grace_period = models.PositiveSmallIntegerField(validators=[MaxValueValidator(30)], help_text="Grace period allowed after the due date")
    lease_agreement_path = models.FileField(upload_to='lease_agreements/', help_text="File path to the lease agreement document")
    lot_image_path = models.FileField(upload_to='images/', help_text="File path to the image of the lot")
    payment_status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS_CHOICES,
        default=LATE,
        help_text="Current payment status of the lease"
    )

    def __str__(self):
        return (f"{self.lease_holder}\n"
                f"{self.monthly_rental_amount} : {self.due_date}\n"
                f"{self.grace_period} : {self.payment_status}\n")  # add later?

class Payment(models.Model):
    # Choices for Payment Method
    CASH = 'Cash'
    CREDIT_CARD = 'Credit Card'
    BANK_TRANSFER = 'Bank Transfer'

    PAYMENT_METHOD_CHOICES = [
        (CASH, 'Cash'),
        (CREDIT_CARD, 'Credit Card'),
        (BANK_TRANSFER, 'Bank Transfer'),
    ]

    lease = models.ForeignKey(Lease, on_delete=models.CASCADE, help_text="The lease the payment is for")
    payment_date = models.DateField(help_text="Date of payment")
    payment_amount = models.DecimalField(max_digits=10, decimal_places=2, help_text="Amount paid")
    payment_method = models.CharField(max_length=50, choices=PAYMENT_METHOD_CHOICES, help_text="Method of payment")
    transaction_id = models.CharField(max_length=200, blank=True, null=True, help_text="Transaction ID if available")
    notes = models.TextField(blank=True, null=True, help_text="Any additional notes or information about the payment")
    receipt = models.FileField(upload_to='payment_receipts/', blank=True, null=True, help_text="Scanned image or PDF of the payment receipt")
    created_at = models.DateTimeField(auto_now_add=True, help_text="When the payment record was created")
    updated_at = models.DateTimeField(auto_now=True, help_text="When the payment record was last updated")
    is_deleted = models.BooleanField(default=False, help_text="Soft delete flag to mark record as deleted without actually removing it")

    class Meta:
        indexes = [
            models.Index(fields=['payment_date']),
        ]

    def save(self, *args, **kwargs):
        super(Payment, self).save(*args, **kwargs)
        related_lease = self.lease
        related_lease.last_payment_date = self.payment_date
        related_lease.last_payment_date_id = self
        related_lease.save()

    def delete(self, using=None, keep_parents=False):
        self.is_deleted = True
        self.save()

    def hard_delete(self, using=None, keep_parents=False):
        super(Payment, self).delete(using, keep_parents)

    def __str__(self):
        return f"{self.lease.lease_holder} - Payment on {self.payment_date}"


class GlobalSettings(models.Model):
    due_date = models.PositiveSmallIntegerField(validators=[MaxValueValidator(30)], help_text="Global due date for all leases")
    grace_period = models.PositiveSmallIntegerField(validators=[MaxValueValidator(30)], help_text="Global grace period for all leases")
