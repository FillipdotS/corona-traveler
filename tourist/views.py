from django.http import HttpResponse
from django.shortcuts import render
from django.db.models import Q
from rest_framework import generics
from .models import Country
from .serializers import CountrySerializer, CountrySerializerBasic
from .forms import FeedbackForm

def index(request):
    return render(request, 'tourist/index.html')

class CountryList(generics.ListAPIView):
    queryset = Country.objects.order_by('name')
    serializer_class = CountrySerializerBasic

#class CountryRetrieve(generics.RetrieveAPIView):
#    queryset = Country.objects.all()
#    serializer_class = CountrySerializer
#    lookup_field = "code"

class CountryAllowedRetrieve(generics.ListAPIView):
    serializer_class = CountrySerializerBasic

    def get_queryset(self):
        code = self.kwargs['code']
        is_eu = Country.objects.get(code=code).eu_country
        
        if (is_eu):
            return Country.objects.filter(
                Q(allowed_from__code=code) | 
                (Q(restriction_level=0) & ~Q(excluded_from__code=code)) |
                Q(restriction_level=1) &
                ~Q(code=code)
            ).distinct()
        
        return Country.objects.filter(
            Q(allowed_from__code=code) | 
            (Q(restriction_level=0) & ~Q(excluded_from__code=code)) &
            ~Q(code=code)
        ).distinct()

def feedback_form(request):
    if request.method == 'POST':
        form = FeedbackForm(request.POST)
        
        if form.is_valid():
            form.save()
            return HttpResponse(status=200)
        return HttpResponse(status=422)
    
    return HttpResponse(status=405)