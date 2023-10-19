from rest_framework.generics import ListAPIView, RetrieveAPIView
from .models import Lease
from .serializers import LeaseSerializer

class LeaseListView(ListAPIView):
    queryset = Lease.objects.all()
    serializer_class = LeaseSerializer

class LeaseDetailView(RetrieveAPIView):
    queryset = Lease.objects.all()
    serializer_class = LeaseSerializer
    lookup_field = 'id'  # or 'pk', or another unique field on the Lease model
