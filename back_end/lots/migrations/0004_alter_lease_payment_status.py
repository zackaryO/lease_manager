# Generated by Django 4.2.6 on 2024-04-06 21:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lots', '0003_alter_globalsettings_due_date_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='lease',
            name='payment_status',
            field=models.CharField(choices=[('up-to-date', 'Up to date'), ('late', 'Late'), ('delinquent', 'Delinquent')], default='up-to-date', help_text='Current payment status of the lease', max_length=20),
        ),
    ]