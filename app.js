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
    }
}


// AFFICHE LE NOM DU RESTAURANT AU CLIC
function onSelectRestaurant(restaurant) {
    $('.restaurant-rating').text("");
    const $restaurantName = $('.restaurant-name');
    $restaurantName.text(restaurant.restaurantName);
    displayAverageNotation(restaurant);
    displayReviews(restaurant);
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

// AFFICHE LA MOYENNE DES ETOILES
function displayAverageNotation(restaurant) {
    let averageStars = 0;
    for (let i = 0; i < restaurant.ratings.length; i++) {
        const $stars = $('.restaurant-stars');
        averageStars += parseInt(restaurant.ratings[i].stars);
        let average = Math.round((averageStars / restaurant.ratings.length) * 10) / 10; // Arrondi au 10ème
        $stars.text("Average : " + average);
    }
}



// TODO: il y a un bug quand on click plusieurs fois sur la map et qu'on ferme la modale sans noter un restaurant, plusieurs markeurs sont créés.
function createRestaurant(event) {
    $('#modal-new-restaurant').addClass('d-block').removeClass('d-none');
    const $addRestaurantBtn = $('#add-restaurant');
    const restaurantLat = event.latLng.lat();
    const restaurantLng = event.latLng.lng();

    $addRestaurantBtn.click(function () {
        const restaurant = {
            "restaurantName": $('#name-new-restaurant').val(),
            "address": $('#address-new-restaurant').val(),
            "lat": restaurantLat,
            "long": restaurantLng,
            "ratings": []
        }
        restaurants.push(restaurant);

        $('#modal-new-restaurant').addClass('d-none').removeClass('d-block');
        $('#name-new-restaurant').val("");
        $('#address-new-restaurant').val("");

        const restaurantMarker = new google.maps.Marker({
            position: event.latLng,
            map: map,
            title: 'New marker',
            draggable: true,
        });

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
        createRestaurant(event)
    })
}



function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}


$("#filter-btn").click(function (restaurant) {
    let choiceDisplayingRestaurants = $("[name=numberOfStars]");
    for (i = 0; i < choiceDisplayingRestaurants.length; i++) {
        if (choiceDisplayingRestaurants[0].checked) {
            console.log("------")
            return
        } else {
            console.log("+++++++")
            return
        }
    }
});


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