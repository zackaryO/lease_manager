from django.contrib import admin
from .models import Lot
from .models import Lease
from .models import LeaseHolder
from .models import GlobalSettings
# Register your models here.

## username for admin: admin password: admin


admin.site.register(Lot)
admin.site.register(Lease)
admin.site.register(LeaseHolder)
admin.site.register(GlobalSettings)