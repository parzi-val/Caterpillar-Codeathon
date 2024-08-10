from django.contrib.auth.models import User
from django.contrib.auth.backends import BaseBackend
from firebase_admin import auth

class FirebaseBackend(BaseBackend):
    def authenticate(self, request, id_token=None):
        try:
            decoded_token = auth.verify_id_token(id_token)
            uid = decoded_token['uid']
            email = decoded_token.get('email')

            user, created = User.objects.get_or_create(username=uid, defaults={'email': email})

            return user
        except Exception as e:
            return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
