from django.urls import path
from .views import LeaseListView, LeaseDetailView

urlpatterns = [
    path('leases/', LeaseListView.as_view(), name='lease-list'),
    path('leases/<int:id>/', LeaseDetailView.as_view(), name='lease-detail'),  # make sure this 'id' matches with 'lookup_field' in your view
]