from django.db import models
from django.contrib.auth.models import User

class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")

    def __str__(self):
        return self.title


class FileVersion(models.Model):
    note = models.ForeignKey(Note, on_delete=models.CASCADE, related_name="file_versions")
    file = models.FileField(upload_to='uploads/')
    title = models.CharField(max_length=255, blank=True)  # Nuovo campo titolo
    comment = models.TextField(blank=True)  # Nuovo campo commento
    created_at = models.DateTimeField(auto_now_add=True)
    previous_version = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name="next_version")

    def __str__(self):
        return f"Versione '{self.title}' di {self.note.title} del {self.created_at}"