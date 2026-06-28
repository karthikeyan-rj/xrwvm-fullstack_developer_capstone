import json
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt

from .models import CarMake, CarModel
from .populate import initiate
from .restapis import get_request, post_review, analyze_review_sentiments


@csrf_exempt
def login_user(request):
    data = json.loads(request.body)
    username = data.get("userName")
    password = data.get("password")
    user = authenticate(username=username, password=password)

    if user is not None:
        login(request, user)
        return JsonResponse({"userName": username, "status": "Authenticated"})

    return JsonResponse({"userName": username, "status": "Failed"})


def logout_user(request):
    logout(request)
    return JsonResponse({"userName": ""})


@csrf_exempt
def registration(request):
    data = json.loads(request.body)
    username = data.get("userName")
    password = data.get("password")
    first_name = data.get("firstName")
    last_name = data.get("lastName")
    email = data.get("email")

    if User.objects.filter(username=username).exists():
        return JsonResponse({"userName": username, "error": "Already Registered"})

    User.objects.create_user(
        username=username,
        password=password,
        first_name=first_name,
        last_name=last_name,
        email=email
    )

    return JsonResponse({"userName": username, "status": "Registered"})


def get_cars(request):
    count = CarMake.objects.count()
    if count == 0:
        initiate()

    cars = []
    for car_model in CarModel.objects.select_related("car_make"):
        cars.append({
            "CarModel": car_model.name,
            "CarMake": car_model.car_make.name,
            "CarMakeId": car_model.car_make.id,
            "CarModelId": car_model.id,
            "DealerId": car_model.dealer_id,
            "Year": car_model.year,
            "Type": car_model.type,
        })

    return JsonResponse({"CarModels": cars})


def get_dealerships(request, state="All"):
    if state == "All":
        dealerships = get_request("/fetchDealers")
    else:
        dealerships = get_request("/fetchDealers/" + state)
    return JsonResponse({"dealers": dealerships})


def get_dealer_details(request, dealer_id):
    dealer = get_request("/fetchDealer/" + str(dealer_id))
    return JsonResponse({"dealer": dealer})


def get_dealer_reviews(request, dealer_id):
    reviews = get_request("/fetchReviews/dealer/" + str(dealer_id))

    for review in reviews:
        review["sentiment"] = "positive"

    return JsonResponse({"reviews": reviews})


@csrf_exempt
def add_review(request):
    if request.method == "POST":
        data = json.loads(request.body)
        response = post_review(data)
        return JsonResponse({"status": "success", "review": response})

    return JsonResponse({"status": "Invalid request"})
