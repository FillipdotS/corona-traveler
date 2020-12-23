from django.urls import path

from . import views

urlpatterns = [
    path('api/country/', views.CountryList.as_view() ),
    #path('api/country/<str:code>/', views.CountryRetrieve.as_view() ),
    path('api/country/<str:code>/allowed/', views.CountryAllowedRetrieve.as_view() ),
    path('feedback/', views.feedback_form, name='feedback'),
    path('', views.index),
]