from django.urls import path
from . import views

urlpatterns = [
    path(route='get_cars', view=views.get_cars, name='getcars'),
    path(route='login', view=views.login_user, name='login'),
    path(route='logout', view=views.logout_user, name='logout'),
    path(route='register', view=views.registration, name='register'),
]
