from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Bike
from .serializers import BikeSerializer, BikeCreateSerializer, UserSerializer
from .permissions import IsSellerOrReadOnly
from .pagination import CustomPagination
from django.contrib.auth import get_user_model
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django_filters.rest_framework import DjangoFilterBackend
from .customFilters import CustomBikeFilter


User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = []  # allow anyone to register

# Bikes CRUD
class BikeViewSet(viewsets.ModelViewSet):
    queryset = Bike.objects.select_related('seller').all().order_by('-created_at')
    serializer_class = BikeSerializer
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend, CustomBikeFilter]
    permission_classes = [IsAuthenticatedOrReadOnly, IsSellerOrReadOnly]
    filterset_fields = {
        "brand": ["in", "exact", "icontains"],
        "model": ["in", "exact", "icontains"]
    }

    def get_serializer_class(self):
        if self.action in ['create']:
            return BikeCreateSerializer
        return BikeSerializer
    
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        print(page)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


    def perform_create(self, serializer):
        # set seller to the logged-in user
        serializer.save(seller=self.request.user)

    # custom action to list bikes added by a given user id
    @action(detail=False, methods=['get'], url_path='by-user/(?P<user_id>[^/.]+)')
    def by_user(self, request, user_id=None):
        bikes = self.queryset.filter(seller_id=user_id)
        page = self.paginate_queryset(bikes)
        if page is not None:
            serializer = BikeSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = BikeSerializer(bikes, many=True)
        return Response(serializer.data)

    # helper to list bikes for currently authenticated user
    @action(detail=False, methods=['get'], url_path='mine', permission_classes=[IsSellerOrReadOnly])
    def mine(self, request):
        if not request.user.is_authenticated:
            return Response({"detail": "Authentication credentials were not provided."}, status=401)
        bikes = self.queryset.filter(seller=request.user)
        page = self.paginate_queryset(self.filter_queryset(bikes))
        if page is not None:
            serializer = BikeSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = BikeSerializer(bikes, many=True)
        return Response(serializer.data)


class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.COOKIES.get("refresh")
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
        except Exception:
            pass

        res = Response({"msg": "Logged out"}, status=status.HTTP_200_OK)
        res.delete_cookie("access")
        res.delete_cookie("refresh")
        return res