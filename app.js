let restaurants;

// AFFICHE LES MARKERS DES RESTAURANTS
function setMarkers(map, data) {
    let shape = {
        coords: [1, 1, 1, 20, 18, 20, 18, 1],
        type: 'poly'
    };

    restaurants = data;

    for (let i = 0; i < data.length; i++) {
        let restaurant = data[i];
        let marker = new google.maps.Marker({
            position: { lat: restaurant.lat, lng: restaurant.long },
            map: map,
            shape: shape,
            title: restaurant.restaurantName
        });
        marker.addListener('click', function () {
            onSelectRestaurant(restaurant);
        });
        
        filter(marker, restaurant)
        resetFilter(marker)
    }
}

function filter(marker, restaurant) {
    $("#filter-btn").click(function () {
        let filterRestaurants = $("[name=numberOfStars]");
        for (i = 0; i < filterRestaurants.length; i++) {
            if ((filterRestaurants[0].checked) && (getAverage(restaurant) >= 4)) {
                marker.setVisible(false);
            } if ((filterRestaurants[0].checked) && (getAverage(restaurant) < 4)) {
                marker.setVisible(true);
            } if ((filterRestaurants[1].checked) && (getAverage(restaurant) >= 4)) {
                marker.setVisible(true);
            } else if ((filterRestaurants[1].checked) && (getAverage(restaurant) < 4)) {
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
    $('.restaurant-rating').text("");
    const $restaurantName = $('.restaurant-name');
    $restaurantName.text(restaurant.restaurantName);
    displayAverageNotation(restaurant);
    displayReviews(restaurant);
    displayStreetViewImage(restaurant)
    $('#btnRate').addClass('d-block').removeClass('d-none');
    closeModal()
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
    $('.restaurant-rating').append(createDiv);
    createDiv.textContent = newRating.comment;
    $('.restaurant-rating').append(createDivForStars);
    createDivForStars.textContent = "Note de l'internaute : " + newRating.stars;
    displayAverageNotation(selectedRestaurant);
    closeModal()
}

// AFFICHE LES AVIS
function displayReviews(restaurant) {
    for (let i = 0; i < restaurant.ratings.length; i++) {
        let createDiv = document.createElement("p");
        let createDivForStars = document.createElement("p");
        $('.restaurant-rating').append(createDiv);
        createDiv.textContent = restaurant.ratings[i].comment;
        $('.restaurant-rating').append(createDivForStars);
        createDivForStars.textContent = "Note de l'internaute : " + restaurant.ratings[i].stars;

    }
}

function getAverage(restaurant) {
    let averageStars = 0;
    let array = []
    for (let i = 0; i < restaurant.ratings.length; i++) {
        totalStars = averageStars += restaurant.ratings[i].stars;
        result = Math.round((totalStars / restaurant.ratings.length) * 10) / 10; // Arrondi au 10ème
        array.push(result)
    } 
    return array[1]
}


// AFFICHE LA MOYENNE DES ETOILES
function displayAverageNotation(restaurant) {
   // let marker;
    let averageStars = 0;
    for (let i = 0; i < restaurant.ratings.length; i++) {
        const $stars = $('.restaurant-stars');
        averageStars += parseInt(restaurant.ratings[i].stars);
        let average = Math.round((averageStars / restaurant.ratings.length) * 10) / 10; // Arrondi au 10ème
        $stars.text("Average : " + average);
    } 
}

function displayStreetViewImage(restaurant) {
    let createDivForStreetView = document.createElement("img");
    $('.restaurant-rating').append(createDivForStreetView);
    createDivForStreetView.src = restaurant.link + apiKey;
}

function createRestaurant(event) {
    $('#modal-new-restaurant').addClass('d-block').removeClass('d-none');
    const $addRestaurantBtn = $('#add-restaurant');
    const restaurantLat = event.latLng.lat();
    const restaurantLng = event.latLng.lng();

    $addRestaurantBtn.click(function () {
        const restaurant = {
            // Penser à ajouter l'id
            "restaurantName": $('#name-new-restaurant').val(),
            "address": $('#address-new-restaurant').val(),
            "lat": restaurantLat,
            "long": restaurantLng,
            "ratings": [],
            "link": `https://maps.googleapis.com/maps/api/streetview?size=600x300&location=${restaurantLat},${restaurantLng}&heading=151.78&pitch=-0.76&key=`
        }

        restaurants.push(restaurant);
        $('#add-restaurant').unbind("click")

        $('#modal-new-restaurant').addClass('d-none').removeClass('d-block');
        $('#name-new-restaurant').val("");
        $('#address-new-restaurant').val("");

        const restaurantMarker = new google.maps.Marker({
            position: event.latLng,
            map: map,
            title: 'New marker',
            draggable: true,
        });

        //restaurantMarker = marker

        restaurantMarker.addListener('click', function () {
            onSelectRestaurant(restaurant);
        });
    })
}


// APPEL DE LA MAP
let map, infoWindow;
let addNewMarker;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 44.8333, lng: -0.5667 },
        zoom: 14
    });

    infoWindow = new google.maps.InfoWindow;

    // GEOLOCALISATION
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            let pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('Vous êtes ici');
            infoWindow.open(map);
            map.setCenter(pos);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
    // Adding a new marker on map
    google.maps.event.addListener(map, 'click', function (event) {
        $('#add-restaurant').unbind("click")
        createRestaurant(event);
    })
}



function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}


function fetchData() {
    return fetch('public/restos.json', { mode: 'no-cors' })
        .then(function (res) {
            return res.json();
        })
        .then(restos => {
            setMarkers(map, restos);
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