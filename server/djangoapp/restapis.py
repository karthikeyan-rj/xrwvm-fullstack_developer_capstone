import requests
import os
from dotenv import load_dotenv

load_dotenv()

backend_url = "http://localhost:3030"
sentiment_analyzer_url = "http://localhost:5050/"

def get_request(endpoint, **kwargs):
    url = backend_url + endpoint
    response = requests.get(url, params=kwargs)
    return response.json()

def analyze_review_sentiments(text):
    request_url = sentiment_analyzer_url + "analyze/" + text
    response = requests.get(request_url)
    return response.json()

def post_review(data_dict):
    url = backend_url + "/insert_review"
    response = requests.post(url, json=data_dict)
    return response.json()
