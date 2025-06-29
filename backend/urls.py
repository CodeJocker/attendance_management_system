from django.contrib import admin
from django.urls import path, include
from attendance.views import *
from rest_framework_simplejwt.views import  TokenObtainPairView , TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    
    path("api/list/user/", ListUserView.as_view(), name="list-user" ),
    path('api/create/user/' , createUserView.as_view() , name="create-user"),
    path('api/delete/user/<int:id>/' , DeleteUserView.as_view() , name="delete-user"),
    path('api/retrieve/user/<int:id>/' , RetrieveUserView.as_view() , name="retrieve-user"),
    path('api/update/user/<int:id>/' , UpdateUserView.as_view() , name="update-user"),
    
    # these are the base user urls
    path('api/auth/user/create/', CreateView.as_view(), name="create"),
    path('api/auth/user/list/', ListView.as_view(), name="list"),
    # path('api/auth/user/delete/<username:username>/', DeleteView.as_view(), name="delete"),
    # path('api/auth/user/update/<username:username>/', UpdateView.as_view(), name="update"),
    
    # this is the attendance url
    path('api/attendance/create/', CreateOrUpdateAttendanceView.as_view(), name="create-attendance"),
    path('api/attendance/list/', ListAttendanceView.as_view(), name="list-attendance"),
    path('api/attendance/retrieve/<int:id>/', RetrieveAttendanceView.as_view(), name="retrieve-attendance"),
    path('api/attendance/retrieve/stats/<int:id>/', RetrieveAttendanceView.as_view(), name="retrieve-attendance"),
    path('api/attendance/retrieve/by-date/', RetrieveAttendanceByDateView.as_view(), name="retrieve-attendance"),
    path('api/attendance/delete/<int:slug>/', DeleteAttendanceView.as_view(), name="delete-attendance"),
    path('api/attendance/update/<int:id>/', UpdateAttendanceView.as_view(), name="update-attendance"),
    path('api/attendance/report/', AttendanceReportView.as_view(), name='attendance-report'),
    
    # these are the token based urls
    path("api/token/" , TokenObtainPairView.as_view() , name="get_token"),
    path("api/token/refresh/" , TokenRefreshView.as_view() , name="refresh_token"),
    
    # get user url
    path('api/current-user/', CurrentUserView.as_view(), name='current_user'),
    
    # these are the rest-framework urls
    path("api-auth/", include('rest_framework.urls')),

    
]+static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)
