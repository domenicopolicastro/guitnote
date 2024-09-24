from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import UserSerializer, NoteSerializer, FileVersionSerializer
from .models import Note, FileVersion
from rest_framework.response import Response
from rest_framework import status

class UserInformations(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Restituisce l'utente attualmente autenticato
        return self.request.user

# Dettaglio di una Nota
class NoteDetail(generics.RetrieveAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)

# Lista e creazione di Note (senza gestire file in questa view)
class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)

# Cancellazione di una Nota
class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)

# Creazione di un utente
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

# Lista delle versioni di file associati a una Nota specifica
class FileVersionListCreate(generics.ListCreateAPIView):
    serializer_class = FileVersionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        note_id = self.kwargs.get('note_id')
        user = self.request.user
        return FileVersion.objects.filter(note__id=note_id, note__author=user)

    def perform_create(self, serializer):
        note_id = self.kwargs.get('note_id')
        user = self.request.user
        note = Note.objects.get(id=note_id, author=user)
        
        # Il serializer accetta anche i nuovi campi title e comment
        serializer.save(note=note)

# Dettaglio di una versione di un file
class FileVersionDetail(generics.RetrieveAPIView):
    serializer_class = FileVersionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        note_id = self.kwargs.get('note_id')
        user = self.request.user
        return FileVersion.objects.filter(note__id=note_id, note__author=user)