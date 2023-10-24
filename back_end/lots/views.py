from rest_framework.generics import ListAPIView, RetrieveAPIView, UpdateAPIView, RetrieveUpdateAPIView
from .models import Lease
from .serializers import LeaseSerializer


class LeaseListView(ListAPIView):
    queryset = Lease.objects.all()
    serializer_class = LeaseSerializer


class LeaseDetailUpdateView(RetrieveUpdateAPIView):
    queryset = Lease.objects.all()
    serializer_class = LeaseSerializer
    lookup_field = 'id'

# from rest_framework.generics import ListAPIView, RetrieveAPIView, UpdateAPIView
# from .models import Lease
# from .serializers import LeaseSerializer
#
#
# class LeaseListView(ListAPIView):
#     queryset = Lease.objects.all()
#     serializer_class = LeaseSerializer
#
#
# class LeaseDetailView(RetrieveAPIView):
#     queryset = Lease.objects.all()
#     serializer_class = LeaseSerializer
#     lookup_field = 'id'  # or 'pk', or another unique field on the Lease model
#
#
# class LeaseUpdateView(UpdateAPIView):
#     queryset = Lease.objects.all()
#     serializer_class = LeaseSerializer
#     lookup_field = 'id'
#     http_method_names = ['patch', 'put', 'get', 'head', 'options']  # explicitly allow methods
#
