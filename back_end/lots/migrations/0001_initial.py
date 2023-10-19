# Generated by Django 4.2.6 on 2023-10-19 15:59

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='GlobalSettings',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('due_date', models.PositiveSmallIntegerField(validators=[django.core.validators.MaxValueValidator(30)])),
                ('grace_period', models.PositiveSmallIntegerField(validators=[django.core.validators.MaxValueValidator(30)])),
            ],
        ),
        migrations.CreateModel(
            name='LeaseHolder',
            fields=[
                ('lease_holder_id', models.AutoField(primary_key=True, serialize=False)),
                ('lease_holder_name', models.CharField(max_length=200)),
                ('lease_address', models.CharField(max_length=200)),
                ('email', models.CharField(max_length=200)),
                ('phone', models.CharField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='Lot',
            fields=[
                ('lot_id', models.AutoField(primary_key=True, serialize=False)),
                ('lot_number', models.IntegerField(unique=True)),
                ('lot_address', models.CharField(max_length=300)),
            ],
        ),
        migrations.CreateModel(
            name='Lease',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('monthly_rental_amount', models.CharField(max_length=200)),
                ('due_date', models.PositiveSmallIntegerField(validators=[django.core.validators.MaxValueValidator(30)])),
                ('grace_period', models.PositiveSmallIntegerField(validators=[django.core.validators.MaxValueValidator(30)])),
                ('lease_agreement_path', models.FileField(upload_to='lease_agreements/')),
                ('lot_image_path', models.FileField(upload_to='lot_image/')),
                ('payment_status', models.CharField(choices=[('up-to-date', 'Up to date'), ('less-than-7', 'Less than 7 days overdue'), ('over-7', 'Over 7 days overdue')], default='less-than-7', max_length=20)),
                ('lease_holder', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='lots.leaseholder')),
                ('lot', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='lots.lot')),
            ],
        ),
    ]