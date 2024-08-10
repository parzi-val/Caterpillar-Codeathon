import firebase_admin
from firebase_admin import credentials, auth

cred = credentials.Certificate(r"C:\Users\laksh\OneDrive\Desktop\Caterpillar\base\base\guidances-firebase-adminsdk-kt2n0-9d1a901b8d.json")
firebase_admin.initialize_app(cred)
