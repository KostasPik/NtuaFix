# Generated by Django 3.2.9 on 2023-10-24 19:50

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('damage_report', '0003_alter_damagereport_report_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='damagereport',
            name='report_uuid',
            field=models.UUIDField(default=uuid.uuid4, editable=False, unique=True),
        ),
        migrations.AlterField(
            model_name='damagereport',
            name='report_id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]
