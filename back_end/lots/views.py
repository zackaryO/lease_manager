from rest_framework import generics, status
from rest_framework.generics import ListAPIView, RetrieveAPIView, UpdateAPIView, RetrieveUpdateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Lease, Payment, Lot
from .serializers import LeaseSerializer, PaymentSerializer, LotSerializer


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


class PaymentBulkDeleteView(APIView):
    """
    Delete multiple payments by providing a list of their IDs.
    """

    def post(self, request, *args, **kwargs):
        # Extract the list of IDs from the request data
        payment_ids = request.data.get('ids', [])

        # Filter the payments by the provided IDs
        payments = Payment.objects.filter(id__in=payment_ids)

        # Soft delete the payments
        payments.update(is_deleted=True)

        return Response({'status': 'payments successfully deleted'}, status=status.HTTP_200_OK)


class LotListView(ListAPIView):
    queryset = Lot.objects.all()
    serializer_class = LotSerializer


class UnoccupiedLotListView(ListAPIView):
    queryset = Lot.objects.filter(occupied=False)
    serializer_class = LotSerializer


class LeaseCreateView(generics.CreateAPIView):
    queryset = Lease.objects.all()
    serializer_class = LeaseSerializer