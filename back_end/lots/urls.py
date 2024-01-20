from django.urls import path
from .views import LeaseListView, LeaseDetailUpdateView, PaymentListCreateView, PaymentBulkDeleteView, LotListView, \
    UnoccupiedLotListView, LeaseCreateView, UserRegistrationAPIView, add_lease_holder, LeaseHolderListView, create_user, \
    UserListView, UserUpdateView, UserDeleteView, lease_holder_detail, edit_lease_holder, delete_lease_holder, \
    lease_create, lease_back_detail, lease_back_list, delete_lease_back, lease_update, lot_list, lot_create, lot_update, \
    lot_delete, CustomLoginView, LeaseHolderView, GlobalSettingsView

urlpatterns = [
    # API urls for client side page interaction start
    path('leases/', LeaseListView.as_view(), name='lease-list'),  # for listing leases
    path('leases/<int:id>/', LeaseDetailUpdateView.as_view(), name='lease-detail-update'),  # for retrieving, updating
    path('payments/', PaymentListCreateView.as_view(), name='payment-list-create'),
    path('payments/delete/', PaymentBulkDeleteView.as_view(), name='payment-bulk-delete'),
    path('leases/lots/', LotListView.as_view(), name='lot-list'),
    path('leases/lots/unoccupied/', UnoccupiedLotListView.as_view(), name='unoccupied-lot-list'),
    path('leases/create/', LeaseCreateView.as_view(), name='lease-create'),  # Endpoint for creating a new lease
    path('register/', UserRegistrationAPIView.as_view(), name='register'),
    path('add_lease_holder/', add_lease_holder, name='add_lease_holder'),
    path('leases/lease_holder/', LeaseHolderView.as_view(), name='lease_holder'),  # For API (frontend)
    path('lease_holders/', LeaseHolderListView.as_view(), name='lease_holder_list'),
    path('lease_holders/<int:lease_holder_id>/', lease_holder_detail, name='lease_holder_detail'),
    path('lease_holders/edit/<int:lease_holder_id>/', edit_lease_holder, name='edit_lease_holder'),
    path('lease_holders/delete/<int:lease_holder_id>/', delete_lease_holder, name='delete_lease_holder'),
    path('global/', GlobalSettingsView.as_view(), name='global'),
    # API urls for client side page interaction start

    # Server Side Rendered templates (pages) start
    path('accounts/login/', CustomLoginView.as_view(), name='login'),
    path('users/', UserListView.as_view(), name='user_list'),
    path('users/create/', create_user, name='create_user'),
    path('users/delete/<int:pk>/', UserDeleteView.as_view(), name='delete_user'),
    path('users/update/<int:pk>/', UserUpdateView.as_view(), name='update_user'),

    path('add_lease/', lease_create, name='lease_create'),
    path('leases_back/', lease_back_list, name='lease_back_list'),
    path('lease_back/<int:lease_id>/', lease_back_detail, name='lease_back_detail'),
    path('lease_update/edit/<int:lease_id>/', lease_update, name='lease_update'),
    path('lease_back/delete/<int:lease_id>/', delete_lease_back, name='delete_lease_back'),

    path('lots/', lot_list, name='lot_list'),
    path('lots/create/', lot_create, name='lot_create'),
    path('lots/<int:pk>/edit/', lot_update, name='lot_update'),
    path('lots/<int:pk>/delete/', lot_delete, name='lot_delete'),
    # Server Side Rendered templates (pages) end
]
