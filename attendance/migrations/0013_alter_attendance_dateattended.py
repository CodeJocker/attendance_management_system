# Generated by Django 5.0.6 on 2024-08-05 13:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('attendance', '0012_alter_attendance_dateattended'),
    ]

    operations = [
        migrations.AlterField(
            model_name='attendance',
            name='DateAttended',
            field=models.DateField(auto_now_add=True),
        ),
    ]
