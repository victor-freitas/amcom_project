import contextlib
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.decorators import action
from sales_controller.api import models, serializers
from rest_framework.views import APIView
from decimal import Decimal
from contextlib import suppress


class ProductViewSet(viewsets.ModelViewSet):
    queryset = models.Product.objects.all()
    serializer_class = serializers.ProductSerializer


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = models.Customer.objects.all()
    serializer_class = serializers.CustomerSerializer


class SellerViewSet(viewsets.ModelViewSet):
    queryset = models.Seller.objects.all()
    serializer_class = serializers.SellerSerializer

class ComissionViewSet(viewsets.ModelViewSet):
    queryset = models.CommissionSettings.objects.all()
    serializer_class = serializers.ComissionSerializer


class SaleViewSet(viewsets.ModelViewSet):
    queryset = models.Sale.objects.all().order_by('-id')

    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.SaleListSerializer
        elif self.action == 'create':
            return serializers.SaleCreateSerializer
        return serializers.SaleCreateSerializer

    def list(self, request, *args, **kwargs):
        serialized_data = self.get_serializer(self.get_queryset(), many=True)
        return Response(serialized_data.data)

    @action(detail=True, methods=['GET'])
    def get_sale_detailed(self, request, pk=None):
        with contextlib.suppress(Exception):
            instance = self.get_object()
            product_id = instance.product.id
            product_name = instance.product.name
            quantity = instance.sale_quantity
            unit_price = instance.product.price
            total_price = quantity * unit_price
            min_commission = instance.commission_settings.min_commission
            max_commission = instance.commission_settings.max_commission

            if total_price <= 500:
                commission_rate = min_commission
            else:
                commission_rate = max_commission

            commission = (round(total_price * commission_rate, 2) / 100)
            
            product_details = {
                'product_id': product_id,
                'sale_id': instance.id,
                'product_name': product_name,
                'quantity': quantity,
                'unit_price': unit_price,
                'total_price': total_price,
                'commission_rate': commission_rate,
                'commission': commission,
            }

            return Response(product_details)


class SellerCommissionViewSet(APIView):

    def get(self, request):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        if not start_date or not end_date:
            return Response({'error': 'As datas de início e término são obrigatórias.'}, status=status.HTTP_400_BAD_REQUEST)

        sales = models.Sale.objects.filter(sale_date__range=[start_date, end_date])
        seller_data = {}

        if sales.exists():
            for sale in sales:
                amount = sale.sale_amount
                seller_id = sale.seller.id
                seller_name = sale.seller.name
                total_commission = Decimal('0.00')
                commission_settings = sale.commission_settings

                if commission_settings:
                    min_commission = commission_settings.min_commission
                    max_commission = commission_settings.max_commission
                    item_commission = amount * min_commission / 100
                    item_commission = amount * max_commission / 100
                    total_commission += item_commission

                if seller_name not in seller_data:
                    seller_data[seller_name] = {
                        'id': seller_id,
                        'name': seller_name,
                        'total_sales': 0,
                        'total_commission': Decimal('0.00')
                    }

                seller_data[seller_name]['total_sales'] += 1
                seller_data[seller_name]['total_commission'] += total_commission

            result = list(seller_data.values())

            return Response(result, status=status.HTTP_200_OK)

        return Response({'detail': {}}, status=status.HTTP_204_NO_CONTENT)