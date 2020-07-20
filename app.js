let restaurants;
let service;
let pos;
let request;
let place;
let map;
let infoWindow;

function filterRestaurantsByRates(marker, place) {
    $("#filter-btn").click(function () {
        let filterRestaurants = $("[name=numberOfStars]");
        for (i = 0; i < filterRestaurants.length; i++) {
            if ((filterRestaurants[0].checked) && (getAverage(place) >= 2)) {
                marker.setVisible(false);
            } if ((filterRestaurants[0].checked) && (getAverage(place) < 2)) {
                marker.setVisible(true);
            } else if ((filterRestaurants[1].checked) && ((getAverage(place) >= 2) && (getAverage(place) < 4))) {
                marker.setVisible(true);
            } else marker.setVisible(false);
            if ((filterRestaurants[2].checked) && (getAverage(place) >= 4)) {
                marker.setVisible(true);
            } if ((filterRestaurants[2].checked) && (getAverage(place) < 4)) {
                marker.setVisible(false);
            } return
        }
    });
}

function resetFilter(marker) {
    $("#reset-btn").click(function () {
        marker.setVisible(true);
    })
}


// AFFICHE LE NOM DU RESTAURANT AU CLIC
function onSelectRestaurant(restaurant) {
    let reviews = []

    if (restaurant.type === "googlePlace") {
        const request = {
            placeId: restaurant.placeId
        };
          
        service = new google.maps.places.PlacesService(map);
        service.getDetails(request, function(place, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                // console.log(place.reviews)
                // reviewAdapter(place.reviews)
                reviews = place.reviews.map(review => reviewAdapter(review))
                displayRestaurantDetails(restaurant, reviews)
            }
        });
        
    } else {
        displayRestaurantDetails(restaurant, restaurant.ratings)
    }
}

function displayRestaurantDetails(restaurant, reviews) {
    $('.restaurant-rating').text("");
    const $restaurantName = $('.restaurant-name');
    $restaurantName.text(restaurant.name);
    displayRestaurantReviews(reviews);
    displayStreetViewImage(restaurant);
    $('#btnRate').addClass('d-block').removeClass('d-none');
    closeModal()
}

// // AFFICHE LES AVIS
function displayRestaurantReviews(reviews) {
    for (let i = 0; i < reviews.length; i++) {
        let createDiv = document.createElement("p");
        let createDivForStars = document.createElement("p");
        $('.restaurant-rating').append(createDiv);
        createDiv.textContent = reviews[i].comment;
        $('.restaurant-rating').append(createDivForStars);
        createDivForStars.textContent = "Note de l'internaute : " + reviews[i].stars;
    }
}

// AJOUTER UN AVIS
function onRateRestaurant() {
    const restaurantName = $('.restaurant-name').text();
    const selectedRestaurant = restaurants.filter(resto => resto.restaurantName === restaurantName)[0];
    const $starsValue = $("#select-stars");
    let newRating = {
        "stars": parseInt($starsValue.val()),
        "comment": $('#review').val()
    };
    selectedRestaurant.ratings.push(newRating);
    $('#review').val("");
    let createDiv = document.createElement("p");
    let createDivForStars = document.createElement("p");
    $('.restaurant-rating').prepend(createDivForStars);
    createDivForStars.textContent = "Note de l'internaute : " + newRating.stars;
    $('.restaurant-rating').prepend(createDiv);
    createDiv.textContent = newRating.comment;
    displayAverageNotation(selectedRestaurant);
    closeModal()
}

function getAverage(place) {

    // C'est schlague -> clean ça
    if (place.type === 'customPlace') {
        let averageStars = 0;
        let array = []
        for (let i = 0; i < place.ratings.length; i++) {
            totalStars = averageStars += place.ratings[i].stars;
            result = Math.round((totalStars / place.ratings.length) * 10) / 10; // Arrondi au 10ème
            array.push(result)
        }
        return array[1]
    } else {
        return [place.ratings]
    }
}

function displayAverageNotation(place) {
    let averageStars = 0;
    if (place.ratings <= 5) {
        const $stars = $('.restaurant-stars');
        $stars.text("Average : " + place.ratings);
    } else {
        for (let i = 0; i < place.ratings.length; i++) {
            const $stars = $('.restaurant-stars');
            averageStars += parseInt(place.ratings[i].stars);
            let average = Math.round((averageStars / place.ratings.length) * 10) / 10; // Arrondi au 10ème
            $stars.text("Average : " + average);
        }
    }
}

function displayStreetViewImage(place) {
    let createDivForStreetView = document.createElement("img");
    $('.restaurant-rating').append(createDivForStreetView);
    createDivForStreetView.src = place.picture + apiKey;
}

function createRestaurant(event) {
    $('#modal-new-restaurant').addClass('d-block').removeClass('d-none');
    const $stars = $('.restaurant-stars');
    const $addRestaurantBtn = $('#add-restaurant');
    const restaurantLat = event.latLng.lat();
    const restaurantLng = event.latLng.lng();

    $addRestaurantBtn.click(function () {

        const restaurantData = {
            address: $('#address-new-restaurant').val(),
            // à voir pour faire une méthode qui incrémente par rapport au resto.json
            id: 1000,
            lat: restaurantLat,
            long: restaurantLng,
            name: $('#name-new-restaurant').val(),
            type: 'customPlace'
        }
        const place = new Place(restaurantData)


        $('#add-restaurant').unbind("click")
        $('#modal-new-restaurant').addClass('d-none').removeClass('d-block');
        $('#name-new-restaurant').val("");
        $('#address-new-restaurant').val("");

        const restaurantMarker = new google.maps.Marker({
            position: event.latLng,
            map: map,
            title: place.name
        });

        restaurantMarker.addListener('click', function () {
            $stars.text("")
            onSelectRestaurant(place);
        });
    })
}


function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 44.8333, lng: -0.5667 },
        zoom: 14
    });

    infoWindow = new google.maps.InfoWindow;

    getLocation()

    // Adding a new marker on map
    google.maps.event.addListener(map, 'click', function (event) {
        $('#add-restaurant').unbind("click")
        createRestaurant(event);
    })
}

function getLocation() {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('Vous êtes ici');
            infoWindow.open(map);
            map.setCenter(pos);
            getNearByPlaces(pos);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
    infowindow = new google.maps.InfoWindow();
}

function getNearByPlaces(pos) {
    request = {
        location: pos,
        type: "restaurant",
        radius: '4000'
    };

    let service = new google.maps.places.PlacesService(map);

    service.nearbySearch(request, function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (let i = 0; i < results.length; i++) {
                const adaptedPlace = placeAdapter(results[i]);
                const place = new Place(adaptedPlace);
                createMarker(place);
            }
        };
    });
}


function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

function createMarker(place) {
    let shape = {
        coords: [1, 1, 1, 20, 18, 20, 18, 1],
        type: 'poly'
    };

    let marker = new google.maps.Marker({
        position: { lat: place.lat, lng: place.long },
        map: map,
        shape: shape,
        title: place.restaurantName
    });

    marker.addListener('click', function () {
        displayAverageNotation(place);
        onSelectRestaurant(place);
    });

    filterRestaurantsByRates(marker, place)
    resetFilter(marker)
}


function fetchData() {
    return fetch('public/restos.json', { mode: 'no-cors' })
        .then(function (res) {
            return res.json();
        })
        .then(restos => {
            initMap()
            return restos
        })
        .then(restos => {
            for (let i = 0; i < restos.length; i++) {
                const place = new Place(restos[i])
                createMarker(place)
            }
        })
        .catch(function (err) {
            console.log('Problème');
            console.log(err);
        })
}



function closeModal() {
    $('#closeModal').click(function () {
        $('#modalRate').addClass('d-none').removeClass('d-block');
    })
}

$('#close-modal-new-restaurant').click(function () {
    $('#modal-new-restaurant').addClass('d-none').removeClass('d-block');
})


$('#btnRate').click(function () {
    $('#modalRate').addClass('d-block').removeClass('d-none');
})

$('#saveRateBtn').click(function () {
    onRateRestaurant();
})

$(document).ready(function () {
    fetchData();
})