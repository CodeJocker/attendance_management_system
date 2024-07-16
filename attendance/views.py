from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import generics
from django.contrib.auth.models import User
from .serializers import UserSerializer, BaseUserSerializer, AttendanceSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import UserModel, Attendance
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response

# Members view

class createUserView(generics.CreateAPIView):
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class ListUserView(generics.ListAPIView):
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class RetrieveUserView(generics.RetrieveAPIView):
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'slug'

class UpdateUserView(generics.UpdateAPIView):
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'slug'

class DeleteUserView(generics.DestroyAPIView):
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'slug'

# Base user views

class CreateView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = BaseUserSerializer
    permission_classes = [AllowAny]

class ListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = BaseUserSerializer
    permission_classes = [AllowAny]

class DeleteView(generics.DestroyAPIView):
    queryset = User.objects.all()
    serializer_class = BaseUserSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'username'

class UpdateView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = BaseUserSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'username'

# Attendance views

class createAttendanceView(generics.CreateAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]

class ListAttendanceView(generics.ListAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]

class UpdateAttendanceView(generics.UpdateAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'topic'

class RetrieveAttendanceView(generics.RetrieveAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'topic'

class DeleteAttendanceView(generics.DestroyAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'topic'


# get user view 
class CurrentUserView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [AllowAny]  

    def get(self, request):
        user = request.user
        data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            # Add any other user fields you want to include
        }
        return Response(data)