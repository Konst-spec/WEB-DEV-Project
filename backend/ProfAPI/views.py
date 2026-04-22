from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from .models import Subject, Professor, Review, WishlistItem
from .serializers import (
    SubjectSerializer,
    ProfessorSerializer,
    ReviewSerializer,
    CreateReviewSerializer,
    LoginSerializer,
    RegisterSerializer,
    WishlistSerializer
)
# Create your views here.
@api_view(['GET'])
def get_subjects(request):
    subjects = Subject.objects.all()
    serializer = SubjectSerializer(subjects, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_professors(request):
    professors = Professor.objects.all()
    serializer = ProfessorSerializer(professors, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_professor(request, prof_id):
    professor = Professor.objects.filter(prof_id=prof_id).first()
    if not professor:
        return Response({"error": "Not found"}, status=404)
    serializer = ProfessorSerializer(professor)
    return Response(serializer.data)

@api_view(['GET'])
def get_subject(request, subj_id):
    subject = Subject.objects.filter(subj_id=subj_id).first()
    if not subject:
        return Response({"error": "Not found"}, status=404)

    professors = Professor.objects.filter(subjects=subject)
    prof_data = []
    for p in professors:
        prof_data.append({
            "id": p.prof_id,
            "name": p.name
        })

    data = {
        "id": subject.subj_id,
        "name": subject.name,
        "description": subject.description,
        "professors": prof_data
    }
    return Response(data)
@api_view(['GET'])
def get_reviews_by_professor(request, prof_id):
    professor = Professor.objects.filter(prof_id=prof_id).first()

    if not professor:
        return Response({"error": "Professor not found"}, status=404)

    reviews = Review.objects.reviewsOfProfessor(professor)

    review_type = request.query_params.get('type')

    if review_type == 'positive':
        reviews = reviews.filter(rating__gte=4.0)
    elif review_type == 'negative':
        reviews = reviews.filter(rating__lte=2.5)

    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data)

class ReviewAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        reviews = Review.objects.all()
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)
    def post(self, request):
        user = request.user
        serializer = CreateReviewSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ReviewDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get_object(self, pk):
        try:
            return Review.objects.get(rev_id=pk)
        except Review.DoesNotExist:
            return None
    
    def get(self, request, pk):
        review = self.get_object(pk)
        if not review:
            return Response({"error": "Review not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = ReviewSerializer(review)
        return Response(serializer.data)
    
    def put(self, request, pk):
        user = request.user
        review = self.get_object(pk)
        if not review:
            return Response({"error": "Review not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = ReviewSerializer(review, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        user = request.user
        review = self.get_object(pk)
        if not review:
            return Response({"error": "Review not found"}, status=status.HTTP_404_NOT_FOUND)
        review.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class LoginAPIView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })
class RegisterAPIView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh)
        }, status=status.HTTP_201_CREATED)

class WishlistAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        items = WishlistItem.objects.filter(user=request.user).select_related('professor', 'subject')
        serializer = WishlistSerializer(items, many=True)
        return Response(serializer.data)

    def post(self, request):
        prof_id = request.data.get('professor')
        subj_id = request.data.get('subject')

        if not prof_id or not subj_id:
            return Response({"error": "professor and subject are required"}, status=status.HTTP_400_BAD_REQUEST)

        prof = Professor.objects.filter(prof_id=prof_id).first()
        subj = Subject.objects.filter(subj_id=subj_id).first()

        if not prof or not subj:
            return Response({"error": "Professor or Subject not found"}, status=status.HTTP_404_NOT_FOUND)

        if WishlistItem.objects.filter(user=request.user, professor=prof, subject=subj).exists():
            return Response({"error": "Already in wishlist"}, status=status.HTTP_400_BAD_REQUEST)

        item = WishlistItem.objects.create(user=request.user, professor=prof, subject=subj)
        serializer = WishlistSerializer(item)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def delete(self, request):
        item_id = request.query_params.get('id')
        if not item_id:
            return Response({"error": "id is required"}, status=status.HTTP_400_BAD_REQUEST)
        item = WishlistItem.objects.filter(id=item_id, user=request.user).first()
        if not item:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)