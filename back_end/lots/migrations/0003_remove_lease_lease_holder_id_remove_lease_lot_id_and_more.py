# Generated by Django 4.2.6 on 2023-10-16 22:23

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('lots', '0002_alter_lease_lease_holder_id_alter_lease_lot_id_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='lease',
            name='lease_holder_id',
        ),
        migrations.RemoveField(
            model_name='lease',
            name='lot_id',
        ),
        migrations.RemoveField(
            model_name='leaseholder',
            name='lease_holder_id',
        ),
        migrations.RemoveField(
            model_name='leaseholder',
            name='lease_phone',
        ),
        migrations.RemoveField(
            model_name='lot',
            name='lot_id',
        ),
        migrations.AddField(
            model_name='lease',
            name='lease_holder',
            field=models.ForeignKey(default=django.utils.timezone.now, on_delete=django.db.models.deletion.CASCADE, to='lots.leaseholder'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='lease',
            name='lot',
            field=models.ForeignKey(default=django.utils.timezone.now, on_delete=django.db.models.deletion.CASCADE, to='lots.lot'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='lot',
            name='lot_number',
            field=models.IntegerField(unique=True),
        ),
    ]
