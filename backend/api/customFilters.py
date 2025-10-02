from rest_framework import filters
from .models import Bike
from django.db.models import Q

class CustomBikeFilter(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        search_text = request.query_params.get("search")

        if(search_text):
            queryset = Bike.objects.filter(Q(model__icontains=search_text) | Q(brand__icontains=search_text))

            return queryset
        return queryset
