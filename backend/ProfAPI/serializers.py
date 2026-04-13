from rest_framework import serializers
from .models import Professor, User, Review, Subject

class ProfessorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Professor
        fields = '__all__'

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['rev_id', 'user', 'professor', 'subject', 'rating', 'difficulty', 'text', 'created_at', 'is_anounimous']

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['subj_id', 'name', 'description']


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        username = data['username']
        password = data['password']
        user = User.objects.filter(username=username).first()
        if not user:
            raise serializers.ValidationError("User not found")
        if not user.check_password(password):
            raise serializers.ValidationError("Wrong password")
        
        data['user'] = user
        return data

class CreateReviewSerializer(serializers.Serializer):
    prof_id = serializers.IntegerField()
    subj_id = serializers.IntegerField()
    rating = serializers.FloatField()
    text = serializers.CharField()
    def validate(self, data):
        user = self.context['request'].user

        if not user or not user.is_authenticated:
            raise serializers.ValidationError("You must be logged in")

        prof = Professor.objects.filter(prof_id=data['prof_id']).first()
        subj = Subject.objects.filter(subj_id=data['subj_id']).first()

        if not prof or not subj:
            raise serializers.ValidationError("Invalid professor or subject")

        if Review.objects.filter(user=user, professor=prof, subject=subj).exists():
            raise serializers.ValidationError("You already left a review")

        return data

class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    def validate(self, data):
        if User.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError("Username already exists")
        return data
    def create(self, validated_data):
        user = User(
            username=validated_data['username']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user