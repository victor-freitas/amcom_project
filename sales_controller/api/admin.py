from django.contrib import admin

from django.contrib import admin
from sales_controller.api import models

admin.site.register(models.Product)
admin.site.register(models.Customer)
admin.site.register(models.Seller)
admin.site.register(models.CommissionSettings)
admin.site.register(models.Sale)