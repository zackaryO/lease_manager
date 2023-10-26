from rest_framework import generics
from rest_framework.generics import ListAPIView, RetrieveAPIView, UpdateAPIView, RetrieveUpdateAPIView
from .models import Lease, Payment
from .serializers import LeaseSerializer, PaymentSerializer


class LeaseListView(ListAPIView):
    queryset = Lease.objects.all()
    serializer_class = LeaseSerializer


class LeaseDetailUpdateView(RetrieveUpdateAPIView):
    queryset = Lease.objects.all()
    serializer_class = LeaseSerializer
    lookup_field = 'id'


class PaymentListCreateView(generics.ListCreateAPIView):
    queryset = Payment.objects.filter(is_deleted=False)
    serializer_class = PaymentSerializer
