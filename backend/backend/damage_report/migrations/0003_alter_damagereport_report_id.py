# Generated by Django 3.2.9 on 2023-10-24 19:48

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('damage_report', '0002_auto_20231024_2213'),
    ]

    operations = [
        migrations.AlterField(
            model_name='damagereport',
            name='report_id',
            field=models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False),
        ),
    ]
