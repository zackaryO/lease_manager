from django.contrib import admin
from .models import Lot, Payment, Lease, LeaseHolder, GlobalSettings, User

# Register your models here.

## username for admin: admin password: admin

admin.site.register(User)
admin.site.register(Lot)
admin.site.register(Lease)
admin.site.register(LeaseHolder)
admin.site.register(Payment)
admin.site.register(GlobalSettings)
