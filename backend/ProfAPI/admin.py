from django.contrib import admin
from .models import User, Professor, Subject, Review

# Register your models here.

admin.site.register(User)
admin.site.register(Professor)
admin.site.register(Subject)
admin.site.register(Review)