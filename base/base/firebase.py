import firebase_admin
from firebase_admin import credentials, auth

cred = credentials.Certificate(r"C:\Users\laksh\OneDrive\Desktop\secrets\secrets.json")
firebase_admin.initialize_app(cred)
