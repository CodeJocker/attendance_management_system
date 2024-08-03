from django.db import models

# Create your models here.

class UserModel(models.Model):
    slug = models.SlugField(unique=True)
    FirstName = models.CharField(max_length=255, null=False , blank=False)
    LastName = models.CharField(max_length=255, null=False , blank=False)
    username = models.CharField(max_length=255, blank=False, null=False, default="username")
    DateOfBirth = models.DateField(null=False, blank=False)
    Tel = models.CharField(max_length=13, blank=True , null=True)
    image = models.ImageField(upload_to='images')
    DateOfChurchEntry = models.DateField()
    DateOfCellEntry = models.DateField()
    
    def __str__(self):
        return f"{self.LastName} - {self.FirstName}"

    
class Attendance(models.Model):
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE, null=False, blank=False)
    status = models.CharField(max_length=10, choices=[
        ('PRESENT', 'Present'),
        ('LATE', 'Late'),
        ('ABSENT', 'Absent')
    ], default='ABSENT')
    DateAttended = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.status} on {self.DateAttended}"
    