from django.urls import path
from .views import LeaseListView, LeaseDetailUpdateView, PaymentListCreateView, PaymentBulkDeleteView

urlpatterns = [
    path('leases/', LeaseListView.as_view(), name='lease-list'),  # for listing leases
    path('leases/<int:id>/', LeaseDetailUpdateView.as_view(), name='lease-detail-update'),  # for retrieving, updating
    path('payments/', PaymentListCreateView.as_view(), name='payment-list-create'),
    path('payments/delete/', PaymentBulkDeleteView.as_view(), name='payment-bulk-delete'),
]
