# Generated by Django 5.0.6 on 2024-07-18 07:26

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('attendance', '0006_attendance_islate'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='attendance',
            name='topic',
        ),
    ]
