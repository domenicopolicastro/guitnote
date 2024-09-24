from django.urls import path
from . import views

urlpatterns = [
    path('users/', views.CreateUserView.as_view(), name='create-user'),
    path('user/', views.UserInformations.as_view(), name='user-info'),
    path('notes/', views.NoteListCreate.as_view(), name='note-list-create'),
    path('notes/<int:pk>/', views.NoteDetail.as_view(), name='note-detail'),
    path('notes/<int:pk>/delete/', views.NoteDelete.as_view(), name='note-delete'),
    path('notes/<int:note_id>/files/', views.FileVersionListCreate.as_view(), name='fileversion-list-create'),
    path('notes/<int:note_id>/files/<int:pk>/', views.FileVersionDetail.as_view(), name='fileversion-detail'),
]
