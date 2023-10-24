from django.urls import path
from .views import LeaseListView, LeaseDetailUpdateView

urlpatterns = [
    path('leases/', LeaseListView.as_view(), name='lease-list'),  # for listing leases
    path('leases/<int:id>/', LeaseDetailUpdateView.as_view(), name='lease-detail-update'),  # for retrieving, updating
]
