from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register("products", views.ProductViewSet, basename='products')
router.register("customers", views.CustomerViewSet, basename='customers')
router.register("sellers", views.SellerViewSet, basename='sellers')
router.register("sale", views.SaleViewSet, basename='sale')
urlpatterns = [
    path('', include(router.urls)),
    path('seller-commissions/', views.SellerCommissionViewSet.as_view())
]