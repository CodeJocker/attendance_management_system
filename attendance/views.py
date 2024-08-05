import logging
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import generics
from django.contrib.auth.models import User
from .serializers import UserSerializer, BaseUserSerializer, AttendanceSerializer, AttendanceStatSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import UserModel, Attendance
from rest_framework.authentication import TokenAuthentication
from rest_framework import status
from rest_framework.response import Response
from django.db import IntegrityError
from django.db.models import Count, Case, When, IntegerField

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
    permission_classes = [AllowAny]
    lookup_field = 'id'

class UpdateUserView(generics.UpdateAPIView):
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id'

class DeleteUserView(generics.DestroyAPIView):
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id'

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
    lookup_field = 'id'
# class Retr(generics.DestroyAPIView):
#     queryset = User.objects.all()
#     serializer_class = BaseUserSerializer
#     permission_classes = [IsAuthenticated]
#     lookup_field = 'id'

class UpdateView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = BaseUserSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

# Attendance views

class CreateOrUpdateAttendanceView(APIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        attendances = request.data
        updated_attendances = []

        for attendance_data in attendances:
            try:
                # Log the incoming data for debugging
                print("Received attendance data:", attendance_data)

                attendance, created = Attendance.objects.update_or_create(
                    user_id=attendance_data['user'],
                    DateAttended=attendance_data.get('date'),  # Use .get() with a default value
                    defaults={'status': attendance_data.get('status', 'ABSENT')}  # Provide a default status
                )
                serializer = AttendanceSerializer(attendance)
                updated_attendances.append(serializer.data)
            except IntegrityError:
                return Response({'error': 'IntegrityError: Duplicate entry for user and date combination'},
                                status=status.HTTP_400_BAD_REQUEST)
            except KeyError as e:
                return Response({'error': f'Missing required field: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

        return Response(updated_attendances, status=status.HTTP_200_OK)
    
class ListAttendanceView(generics.ListAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [AllowAny]

class UpdateAttendanceView(generics.UpdateAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id'

class RetrieveAttendanceView(generics.RetrieveAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id'

class DeleteAttendanceView(generics.DestroyAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id'

class AttendanceStatView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    serializer_class = AttendanceStatSerializer

    def get_object(self):
        user_id = self.kwargs['id']
        stats = Attendance.objects.filter(user_id=user_id).aggregate(
            totalAttendance=Count('id'),
            presentCount=Count(Case(When(isAttended=True, then=1), output_field=IntegerField())),
            absentCount=Count(Case(When(isAttended=False, then=1), output_field=IntegerField()))
        )
        return stats

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