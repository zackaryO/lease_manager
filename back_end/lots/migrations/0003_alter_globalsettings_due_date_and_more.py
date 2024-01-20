# Generated by Django 4.2.6 on 2024-01-20 19:59

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('lots', '0002_lease_last_payment_date_lease_last_payment_date_id_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='globalsettings',
            name='due_date',
            field=models.PositiveSmallIntegerField(help_text='Global due date for all leases', validators=[django.core.validators.MaxValueValidator(30)]),
        ),
        migrations.AlterField(
            model_name='globalsettings',
            name='grace_period',
            field=models.PositiveSmallIntegerField(help_text='Global grace period for all leases', validators=[django.core.validators.MaxValueValidator(30)]),
        ),
        migrations.AlterField(
            model_name='lease',
            name='due_date',
            field=models.PositiveSmallIntegerField(help_text='Due date for monthly payments', validators=[django.core.validators.MaxValueValidator(30)]),
        ),
        migrations.AlterField(
            model_name='lease',
            name='grace_period',
            field=models.PositiveSmallIntegerField(help_text='Grace period allowed after the due date', validators=[django.core.validators.MaxValueValidator(30)]),
        ),
        migrations.AlterField(
            model_name='lease',
            name='lease_agreement_path',
            field=models.FileField(help_text='File path to the lease agreement document', upload_to='lease_agreements/'),
        ),
        migrations.AlterField(
            model_name='lease',
            name='lease_holder',
            field=models.ForeignKey(help_text='The lease holder associated with this lease', on_delete=django.db.models.deletion.PROTECT, to='lots.leaseholder'),
        ),
        migrations.AlterField(
            model_name='lease',
            name='lot',
            field=models.ForeignKey(help_text='The lot associated with the lease', on_delete=django.db.models.deletion.CASCADE, to='lots.lot'),
        ),
        migrations.AlterField(
            model_name='lease',
            name='lot_image_path',
            field=models.FileField(help_text='File path to the image of the lot', upload_to='images/'),
        ),
        migrations.AlterField(
            model_name='lease',
            name='monthly_rental_amount',
            field=models.IntegerField(help_text='Monthly rental amount for the lease'),
        ),
        migrations.AlterField(
            model_name='lease',
            name='payment_status',
            field=models.CharField(choices=[('up-to-date', 'Up to date'), ('late', 'Late'), ('delinquent', 'Delinquent')], default='late', help_text='Current payment status of the lease', max_length=20),
        ),
        migrations.AlterField(
            model_name='leaseholder',
            name='email',
            field=models.CharField(help_text='Email address of the lease holder', max_length=200),
        ),
        migrations.AlterField(
            model_name='leaseholder',
            name='lease_holder_address',
            field=models.CharField(help_text='Address of the lease holder', max_length=200),
        ),
        migrations.AlterField(
            model_name='leaseholder',
            name='lease_holder_first_name',
            field=models.CharField(help_text='First name of the lease holder', max_length=200),
        ),
        migrations.AlterField(
            model_name='leaseholder',
            name='lease_holder_last_name',
            field=models.CharField(help_text='Last name of the lease holder', max_length=200),
        ),
        migrations.AlterField(
            model_name='leaseholder',
            name='phone',
            field=models.CharField(help_text='Phone number of the lease holder', max_length=200),
        ),
        migrations.AlterField(
            model_name='lot',
            name='lot_address',
            field=models.CharField(help_text='Address of the lot', max_length=300),
        ),
        migrations.AlterField(
            model_name='lot',
            name='lot_number',
            field=models.IntegerField(help_text='Unique number identifying the lot', unique=True),
        ),
        migrations.AlterField(
            model_name='lot',
            name='occupied',
            field=models.BooleanField(default=False, help_text='Flag to indicate if the lot is currently occupied'),
        ),
        migrations.AlterField(
            model_name='user',
            name='user_type',
            field=models.PositiveSmallIntegerField(choices=[(1, 'staff'), (2, 'customer')], help_text='The type of user (staff or customer)'),
        ),
    ]
