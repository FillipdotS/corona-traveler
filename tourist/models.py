from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

# Create your models here.
class Country(models.Model):
	code = models.CharField(max_length=2, primary_key=True)
	name = models.CharField(max_length=50)

	allowed_from = models.ManyToManyField(
		'self',
		blank=True,
		symmetrical=False,
		help_text="Citizens from these countries are allowed in.",
		related_name='allowances'
	)

	eu_country = models.BooleanField(default=False)

	restriction_level = models.IntegerField(
		validators=[MinValueValidator(0), MaxValueValidator(10)],
		help_text="0 - No restrictions, 1 - Allow EU countries, 10 - Full restrictions",
		default=5
	)

	excluded_from = models.ManyToManyField(
		'self',
		blank=True,
		symmetrical=False,
		help_text="Citizens from these countries are NOT allowed in.",
		related_name='exclusions'
	)

	def __str__(self):
		return self.name

	class Meta:
		ordering = ['name']

class Feedback(models.Model):
	email = models.EmailField(max_length=100, blank=True)
	subject = models.CharField(max_length=100)
	message = models.TextField(max_length=10000)
	date_sent = models.DateField(auto_now_add=True)

	def __str__(self):
		return self.subject