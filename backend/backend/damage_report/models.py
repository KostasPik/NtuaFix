from django.db import models
from django.utils.text import slugify
from django.core.files.uploadedfile import InMemoryUploadedFile
import os
from PIL import Image
from io import BytesIO
from django.dispatch import receiver
from backend.storages import OverwriteStorage
from django.utils import timezone
from django.dispatch import receiver
import uuid

# Create your models here.


def compress_image(thumbnail, width_specified, image_name, quality=70):
    try:
        with Image.open(thumbnail) as temp_image:
            output_io_stream = BytesIO()
            width, height = temp_image.size
            aspect_ratio = width / height
            final_image = temp_image.resize((width_specified, int(width_specified / aspect_ratio)))
            final_image.save(output_io_stream, format='WebP', quality=quality, optimize=True)
            output_io_stream.seek(0)
            final_image = InMemoryUploadedFile(output_io_stream, None, image_name+".webp", 'image/webp', output_io_stream.tell(), None)
            return final_image
    except Exception as e:
        print(f"Error: {e}")
        raise e

NOT_SCHEDULED = "ΚΑΜΙΑ ΕΝΕΡΓΕΙΑ"
SCHEDULED = "ΠΡΟΣ ΕΠΙΣΚΕΥΗ"
FIXED = "ΕΠΙΣΚΕΥΑΣΤΗΚΕ"
DAMAGE_STATES = [
    (NOT_SCHEDULED, "ΚΑΜΙΑ ΕΝΕΡΓΕΙΑ"),
    (SCHEDULED, "ΠΡΟΣ ΕΠΙΣΚΕΥΗ"),
    (FIXED, "ΕΠΙΣΚΕΥΑΣΤΗΚΕ"),
]

DANGEROUS_DAMAGE = "ΕΠΙΚΙΝΔΥΝΗ ΒΛΑΒΗ"
IRRITATING_DAMAGE = "ΕΝΟΧΛΗΤΙΚΗ ΒΛΑΒΗ"
AESTHETIC_DAMAGE = "ΑΙΣΘΗΤΙΚΗ ΒΛΑΒΗ"
DAMAGE_TYPES = [
    (DANGEROUS_DAMAGE, "ΕΠΙΚΙΝΔΥΝΗ ΒΛΑΒΗ"),
    (IRRITATING_DAMAGE, "ΕΝΟΧΛΗΤΙΚΗ ΒΛΑΒΗ"),
    (AESTHETIC_DAMAGE, "ΑΙΣΘΗΤΙΚΗ ΒΛΑΒΗ"),
]



class DamageType(models.Model):
    """
    A Django model for the type of damage recorder by the end-user.
    
    We keep a default_selected attribute because this row id is going to be preselected at the user client form.
    """
    damage_type = models.CharField(max_length=200, unique=True, primary_key=True)
    # default_selected = models.BooleanField(default=False, help_text="Η επιλογή θα είναι προεπιλεγμένη στην εφαρμογή του χρήστη.", unique=True)

    def __str__(self):
        return str(self.damage_type)

    class Meta:
        verbose_name_plural = "Τύποι Ζημιών"

    def save(self, *args, **kwargs):
        self.damage_type = self.damage_type.strip()
        super(DamageType, self).save(*args, **kwargs)

class DamageReportStatus(models.Model):
    """
    A Django model for the status of fixing the damage recorder by the end-user.

    We keep a not_fixed attribute because this is going to be the default foreign key id for reports that have not been addressed yet.
    """    
    damage_status = models.CharField(max_length=200, unique=True, primary_key=True)
    # not_fixed = models.BooleanField(default=False, help_text="Η επιλογή αντιστοιχεί στην κατάσταση που δεν έχει παρθεί ενέργεια για την αποκατάσταση της ζημιάς.", unique=True)

    def __str__(self):
        return str(self.damage_status)
    
    class Meta:
        verbose_name_plural = "Καταστάσεις Ζημιών"

    def save(self, *args, **kwargs):
        self.damage_status = self.damage_status.strip()
        super(DamageReportStatus, self).save(*args, **kwargs)

class DamageReport(models.Model):


    def get_image_path(instance, filename):
        return os.path.join('damages', str(instance.report_uuid), filename)

    report_id = models.AutoField(primary_key=True)
    report_uuid = models.UUIDField(unique=True, default=uuid.uuid4, editable=False)
    image = models.ImageField(max_length=500,upload_to=get_image_path, storage=OverwriteStorage)
    damage_type = models.ForeignKey(DamageType, on_delete=models.CASCADE)
    damage_status = models.ForeignKey(DamageReportStatus, on_delete=models.CASCADE)
    description = models.TextField(max_length=1000, help_text="Περιγραφή της ζημιάς από τον χρήστη.")
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    damage_report_notes = models.TextField(max_length=10000, help_text="Σημειώσεις για την επισκευή της ζημιάς (από την διοίκηση της σχολής).")
    created_at = models.DateTimeField(auto_now_add=True)
    fixed_time = models.DateTimeField(blank=True,null=True,help_text="Ημερομηνία που επιδιορθώθηκε η βλάβη (εάν έχει επιδιορθωθεί).")
    towards_fixing_time = models.DateTimeField(blank=True,null=True,help_text="Ημερομηνία που τέθηκε προς επισκευή η βλάβη (εάν έχει τεθεί).")

    @property
    def damage_report_name(self):
        return str(self)

    def __str__(self):
        return "Ζημιά no:" + str(self.report_id)
    

    def save(self, *args, **kwargs):
        self.description = self.description.strip()

        image_name = "report-"+str(self.report_uuid)
        if os.path.basename(self.image.name) != image_name + '.webp':
            self.image = compress_image(self.image, 1200, image_name)

        if self.damage_report_notes:
            self.damage_report_notes = self.damage_report_notes.strip()
        
        # old_model = DamageReport.objects.filter(report_id=self.report_id).select_related('damage_status', 'damage_type')
        # if old_model.exists():
        #     if old_model.damage_status != self.damage_status:
        #         if self.damage_status == FIXED:
        #             self.fixed_time = timezone.now()
        #         elif self.damage_status == SCHEDULED:
        #             self.towards_fixing_time = timezone.now()


        super(DamageReport, self).save(*args, **kwargs)

    class Meta:
        verbose_name_plural = 'Αναφορές Ζημιών'


import shutil
@receiver(models.signals.post_delete, sender=DamageReport)
def auto_delete_file_on_delete(sender, instance, **kwargs):
    """
    Deletes image file from filesystem
    when corresponding `DamageReport` object is deleted.
    """

    if instance.banner:
        if os.path.isfile(instance.image.path):
            os.remove(instance.image.path)
        if os.path.exists(os.path.dirname(instance.image.path)):
            shutil.rmtree(os.path.dirname(instance.image.path), ignore_errors=True)
    if os.path.exists(os.path.join('media', 'damages', "report-"+str(instance.report_id))):
            shutil.rmtree(os.path.join('media', 'damages', "report-"+str(instance.report_id)), ignore_errors=True)