from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from django.conf import settings
from django.contrib.auth.models import AbstractUser

class Role(models.TextChoices):
    STUDENT = 'student', 'Student'
    ADMIN = 'admin', 'Admin'

class School(models.TextChoices):
    SITE = 'site', 'Site'
    ISE = 'ise', 'Ise'
    BS = 'bs', 'Bs'
    SENGI = 'sengi', 'Sengi'
    KMA = 'kma', 'Kma'
    SOG = 'sog', 'Sog'

class User(AbstractUser):
    username = models.CharField(max_length=30, unique=True)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.STUDENT)
    course = models.FloatField(default=1, validators=[
        MaxValueValidator(4.0),
        MinValueValidator(1.0)
    ])
    school = models.CharField(max_length=10, choices=School.choices)

class Professor(models.Model):
    prof_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200)
    description = models.TextField()
    subjects = models.ManyToManyField('Subject', related_name='professors')

class Subject(models.Model):
    subj_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    description = models.TextField()

class ReviewManager(models.Manager):
    def reviewsOfProfessor(self, prof):
        return self.filter(professor=prof)
    def positiveReviews(self, prof):
        return self.filter(professor=prof, rating__gte = 4.0)
    def negativeReviews(self, prof):
        return self.filter(professor=prof, rating__lte = 2.5)
    
    
class Review(models.Model):
    rev_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews')
    professor = models.ForeignKey(Professor, on_delete=models.CASCADE, related_name='reviews')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='reviews')
    rating = models.FloatField(default=5, validators=[
        MaxValueValidator(5.0),
        MinValueValidator(1.0)
    ])
    difficulty = models.FloatField(default=5, validators=[
        MaxValueValidator(5.0),
        MinValueValidator(1.0)
    ])
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_anounimous = models.BooleanField(default=False)
    objects = ReviewManager()


class WishlistItem(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='wishlist')
    professor = models.ForeignKey(Professor, on_delete=models.CASCADE, related_name='wishlisted_by')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='wishlisted_for')
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'professor', 'subject')

    def __str__(self):
        return f"{self.user.username} → {self.professor.name} ({self.subject.name})"


