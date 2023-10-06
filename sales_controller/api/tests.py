import datetime
from decimal import Decimal
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from .models import Product, Customer, Seller, Sale, CommissionSettings

class SalesControllerTestCase(TestCase):
    def setUp(self):
        self.product = Product.objects.create(
            codigo='123',
            descricao='Produto de Teste',
            valor_unitario=Decimal('10.00'),
            percentual_comissao=Decimal('5.00')
        )
        self.customer = Customer.objects.create(
            name='Cliente de Teste',
            email='cliente@teste.com',
            phone_number='123-456-7890'
        )
        self.seller = Seller.objects.create(
            name='Vendedor de Teste',
            email='vendedor@teste.com',
            phone_number='987-654-3210'
        )
        self.commission_settings = CommissionSettings.objects.create(
            day_of_week=0,
            min_commission=Decimal('3.00'),
            max_commission=Decimal('5.00')
        )
        self.sale = Sale.objects.create(
            product=self.product,
            customer=self.customer,
            seller=self.seller,
            sale_date=datetime.date.today(),
            sale_amount=Decimal('100.00'),
            commission_settings=self.commission_settings
        )
        self.client = APIClient()

    def test_product_list(self):
        url = f'api/products/{self.products.pk}/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_customer_list(self):
        url = f'api/sellers/{self.seller.pk}/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_seller_list(self):
        url = f'api/sellers/{self.seller.pk}/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_sale(self):
        url = f'api/sale/{self.sale.pk}/'
        data = {
            'product': self.product.id,
            'customer': self.customer.id,
            'seller': self.seller.id,
            'sale_date': datetime.date.today(),
            'sale_amount': Decimal('100.00'),
            'commission_settings': self.commission_settings.id
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
