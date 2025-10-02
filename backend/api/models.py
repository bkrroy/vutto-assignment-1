from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser, PermissionsMixin, BaseUserManager
)

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

class Bike(models.Model):
    id = models.AutoField(primary_key=True)
    brand = models.CharField(max_length=120)
    model = models.CharField(max_length=120)
    year = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=12, decimal_places=2)
    kilometers_driven = models.PositiveIntegerField()
    location = models.CharField(max_length=255)
    imageUrl = models.URLField(max_length=1000, blank=True, null=True)
    # seller FK links to who created/added this bike
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bikes')
    # store sellerId explicitly as requested (kept in sync)
    sellerId = models.PositiveIntegerField(editable=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if self.seller:
            self.sellerId = self.seller.id
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.brand} {self.model} ({self.year})"
