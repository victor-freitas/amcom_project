from rest_framework.response import Response
from rest_framework import viewsets, status
from sales_controller.api import models, serializers
from rest_framework.views import APIView
from decimal import Decimal


class ProductViewSet(viewsets.ModelViewSet):
    queryset = models.Product.objects.all()
    serializer_class = serializers.ProductSerializer


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = models.Customer.objects.all()
    serializer_class = serializers.CustomerSerializer


class SellerViewSet(viewsets.ModelViewSet):
    queryset = models.Seller.objects.all()
    serializer_class = serializers.SellerSerializer


class SaleViewSet(viewsets.ModelViewSet):
    queryset = models.Sale.objects.all()
    serializer_class = serializers.SaleSerializer


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
                        'name': seller_name,
                        'total_sales': 0,
                        'total_commission': Decimal('0.00')
                    }

                seller_data[seller_name]['total_sales'] += 1
                seller_data[seller_name]['total_commission'] += total_commission

            result = list(seller_data.values())

            return Response(result, status=status.HTTP_200_OK)

        return Response({'detail': {}}, status=status.HTTP_204_NO_CONTENT)