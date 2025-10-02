from rest_framework import serializers
from .models import User, Bike
from django.contrib.auth import get_user_model
from rest_framework.validators import UniqueValidator

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=6)

    class Meta:
        model = get_user_model()
        fields = ('id', 'email', 'full_name', 'password')

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = get_user_model().objects.create_user(password=password, **validated_data)
        return user

class BikeSerializer(serializers.ModelSerializer):
    seller = UserSerializer(read_only=True)
    sellerId = serializers.IntegerField(read_only=True)

    class Meta:
        model = Bike
        fields = [
            'id', 'brand', 'model', 'year', 'price', 'kilometers_driven',
            'location', 'imageUrl', 'seller', 'sellerId', 'created_at', 'updated_at'
        ]

class BikeCreateSerializer(serializers.ModelSerializer):
    # used for create so seller is set from request.user
    class Meta:
        model = Bike
        fields = [
            'id', 'brand', 'model', 'year', 'price', 'kilometers_driven',
            'location', 'imageUrl'
        ]
