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
    console.log(restaurant);
    $('.restaurant-rating').text("");
    const $restaurantName = $('.restaurant-name');
    $restaurantName.text(restaurant.restaurantName);
    displayStars(restaurant);
    displayComments(restaurant);
    $('#btnRate').addClass('d-block').removeClass('d-none');
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
}

// AFFICHE LES AVIS
function displayComments(restaurant) {
    for (let i = 0; i < restaurant.ratings.length; i++) {
        let createDiv = document.createElement("p");
        $('.restaurant-rating').append(createDiv);
        createDiv.textContent = restaurant.ratings[i].comment;
    }
}

// AFFICHE LA MOYENNE DES ETOILES
function displayStars(restaurant) {
    let averageStars = 0;
    for (let i = 0; i < restaurant.ratings.length; i++) {
        const $stars = $('.restaurant-stars');
        averageStars += parseInt(restaurant.ratings[i].stars);
        let average = Math.round((averageStars / restaurant.ratings.length) * 10) / 10 // Arrondi au 10ème
        $stars.text("Average Stars : " + average);
    } 
}


// APPEL DE LA MAP
let map, infoWindow;
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
        // .then(restos => {
        //     saveToSessionStorage(restos);
        // })
        .catch(function (err) {
            console.log('Problème');
            console.log(err);
        })
}

$('#closeModal').click(function () {
    $('#modalRate').addClass('d-none').removeClass('d-block');
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