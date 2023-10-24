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
    lease_holder = models.ForeignKey(LeaseHolder, on_delete=models.CASCADE)  # Foreign Key related to LeaseHolder
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


class GlobalSettings(models.Model):  # should only be one entry
    due_date = models.PositiveSmallIntegerField(validators=[MaxValueValidator(30)])
    grace_period = models.PositiveSmallIntegerField(validators=[MaxValueValidator(30)])
