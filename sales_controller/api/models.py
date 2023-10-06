from django.db import models


class Product(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=0)
    
    def __str__(self):
        return self.name


class Customer(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15)
    
    def __str__(self):
        return self.name


class CommissionSettings(models.Model):
    day_of_week = models.CharField(max_length=10, unique=True)
    min_commission = models.DecimalField(max_digits=4, decimal_places=2)
    max_commission = models.DecimalField(max_digits=4, decimal_places=2)
    
    def __str__(self):
        return self.day_of_week


class Seller(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15)
    
    def __str__(self):
        return self.name


class Sale(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    seller = models.ForeignKey(Seller, on_delete=models.CASCADE)
    sale_date = models.DateField()
    sale_amount = models.DecimalField(max_digits=10, decimal_places=2)
    commission_settings = models.ForeignKey(CommissionSettings, on_delete=models.SET_NULL, null=True, blank=True)
    sale_quantity = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"Venda de {self.product} para {self.customer} feita por {self.seller}"