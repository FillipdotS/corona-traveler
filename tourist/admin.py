from django.contrib import admin
from .models import Country, Feedback

class CountryAdmin(admin.ModelAdmin):
    search_fields = ('name', 'code')
    list_display = ('code', 'name', 'restriction_level', 'eu_country')

class FeedbackAdmin(admin.ModelAdmin):
    search_fields = ('email', 'subject', 'message', 'date_sent')
    list_display = ('subject', 'email', 'message', 'date_sent')

admin.site.register(Country, CountryAdmin)
admin.site.register(Feedback, FeedbackAdmin)