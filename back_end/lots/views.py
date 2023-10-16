from rest_framework import generics
from .serializers import LeaseSerializer
from .models import Lease

class LeaseList(generics.ListAPIView):
    queryset = Lease.objects.all()
    serializer_class = LeaseSerializer
