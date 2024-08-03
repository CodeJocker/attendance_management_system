from django.db.models import Count, Case, When, IntegerField
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ('__all__')    
        
class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = '__all__'
    
class BaseUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id","username","email","password"]
        extra_kwargs = {"password" : {"write_only" : True}}
        
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
        
    

class AttendanceStatSerializer(serializers.Serializer):
    totalAttendance = serializers.IntegerField()
    presentCount = serializers.IntegerField()
    absentCount = serializers.IntegerField()
