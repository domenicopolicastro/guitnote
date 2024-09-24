from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note, FileVersion
# Serializer per l'utente
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

# Serializer per le versioni dei file
class FileVersionSerializer(serializers.ModelSerializer):
    previous_version = serializers.PrimaryKeyRelatedField(
        queryset=FileVersion.objects.all(), 
        allow_null=True, 
        required=False
    )  # Permette di impostare previous_version in fase di creazione
    previous_version_data = serializers.SerializerMethodField()  # Campo separato per leggere i dati della versione precedente

    class Meta:
        model = FileVersion
        fields = ['id', 'file', 'title', 'comment', 'created_at', 'previous_version', 'previous_version_data', 'note']
        extra_kwargs = {"note": {"read_only": True}}  # La nota è in sola lettura
    
    def get_previous_version_data(self, obj):
        if obj.previous_version:
            return {
                "id": obj.previous_version.id,
                "created_at": obj.previous_version.created_at,
                "file": obj.previous_version.file.url,
                "title": obj.previous_version.title
            }
        return None
# Serializer per l'utente
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
# Serializer per la nota
class NoteSerializer(serializers.ModelSerializer):
    # Aggiungiamo un campo che elenca tutte le versioni di file associate a una nota
    file_versions = FileVersionSerializer(many=True, read_only=True)  # Questo mostrerà tutte le versioni dei file

    class Meta:
        model = Note
        fields = ["id", "title", "content", "created_at", "author", "file_versions"]
        extra_kwargs = {"author": {"read_only": True}}  # L'autore è solo in lettura e viene impostato automaticamente