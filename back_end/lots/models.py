from django.core.validators import MaxValueValidator
from django.db import models


# Create your models here.

class Lot(models.Model):
    lot_number = models.IntegerField(unique=True)
    lot_address = models.CharField(max_length=300)

    def __str__(self):
        return self.lot_number


class LeaseHolder(models.Model):
    lease_holder_first_name = models.CharField(max_length=200)
    lease_holder_last_name = models.CharField(max_length=200)
    lease_holder_address = models.CharField(max_length=200)
    email = models.CharField(max_length=200)
    phone = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.lease_holder_first_name} : {self.lease_holder_last_name}\n"


class Lease(models.Model):
    UP_TO_DATE = 'up-to-date'
    LESS_THAN_7 = 'less-than-7'
    OVER_7 = 'over-7'

    PAYMENT_STATUS_CHOICES = [
        (UP_TO_DATE, 'Up to date'),
        (LESS_THAN_7, 'Less than 7 days overdue'),
        (OVER_7, 'Over 7 days overdue'),
    ]

    def __str__(self):
        return (f"{self.lease_holder}\n"
                f"{self.monthly_rental_amount} : {self.due_date}\n"
                f"{self.grace_period} : {self.payment_status}\n")  # add later?

    lot = models.ForeignKey(Lot, on_delete=models.CASCADE)  # Foreign Key related to Lot
    lease_holder = models.ForeignKey(LeaseHolder, on_delete=models.PROTECT)  # Foreign Key related to LeaseHolder
    monthly_rental_amount = models.IntegerField()
    due_date = models.PositiveSmallIntegerField(validators=[MaxValueValidator(30)])
    grace_period = models.PositiveSmallIntegerField(validators=[MaxValueValidator(30)])
    lease_agreement_path = models.FileField(upload_to='lease_agreements/')
    lot_image_path = models.FileField(upload_to='images/')
    payment_status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS_CHOICES,
        default=LESS_THAN_7,
    )


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
    receipt = models.FileField(upload_to='payment_receipts/', blank=True, null=True,
                               help_text="Scanned image or PDF of the payment receipt")
    created_at = models.DateTimeField(auto_now_add=True, help_text="When the payment record was created")
    updated_at = models.DateTimeField(auto_now=True, help_text="When the payment record was last updated")
    is_deleted = models.BooleanField(default=False,
                                     help_text="Soft delete flag to mark record as deleted without actually removing it")

    class Meta:
        indexes = [
            models.Index(fields=['payment_date']),
        ]

    def save(self, *args, **kwargs):
        # Before saving the payment, update the payment_status of the associated lease
        related_lease = self.lease
        related_lease.payment_status = Lease.UP_TO_DATE
        related_lease.save()
        super(Payment, self).save(*args, **kwargs)

    def delete(self, using=None, keep_parents=False):
        self.is_deleted = True
        self.save()

    def hard_delete(self, using=None, keep_parents=False):
        super(Payment, self).delete(using, keep_parents)

    def __str__(self):
        return f"{self.lease.lease_holder} - Payment on {self.payment_date}"


# ... rest of your models


class GlobalSettings(models.Model):  # should only be one entry
    due_date = models.PositiveSmallIntegerField(validators=[MaxValueValidator(30)])
    grace_period = models.PositiveSmallIntegerField(validators=[MaxValueValidator(30)])
