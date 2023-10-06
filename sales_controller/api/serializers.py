from rest_framework import serializers
from .models import Product, Customer, Seller, Sale, CommissionSettings

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'

class SellerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seller
        fields = '__all__'

class SaleListSerializer(serializers.ModelSerializer):
    customer = serializers.CharField(source='customer.name', read_only=True)
    seller = serializers.CharField(source='seller.name', read_only=True)

    class Meta:
        model = Sale
        fields = '__all__'
        
        
class SaleCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Sale
        fields = '__all__'
        
        
class ComissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommissionSettings
        fields = '__all__'