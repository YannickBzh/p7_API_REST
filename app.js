let restaurants

// AFFICHE LES MARKERS DES RESTAURANTS
function setMarkers(map, data) {
    let shape = {
        coords: [1, 1, 1, 20, 18, 20, 18, 1],
        type: 'poly'
    };

    restaurants = data

    for (let i = 0; i < data.length; i++) {
        let restaurant = data[i];
        let marker = new google.maps.Marker({
            position: { lat: restaurant.lat, lng: restaurant.long },
            map: map,
            shape: shape,
            title: restaurant.restaurantName
        });
        marker.addListener('click', function () {
            // console.log(restaurant.ratings);

            // console.log($(this)[0].title)
            onSelectRestaurant(restaurant)
            // data.re            


            // let restaurantName = restaurant.restaurantName;
            // let ratingsA = restaurant.ratings[0].comment;
            // let ratingsB = restaurant.ratings[1].comment;
            // let paragrapheA = document.createElement("p");
            // let paragrapheB = document.createElement("p");
            // let paragrapheC = document.createElement("p");
            // $('#displayRatings').html(restaurantName);
            // $('#displayRatings').append(paragrapheA);
            // paragrapheA.textContent = ratingsA;
            // $('#displayRatings').append(paragrapheB);
            // paragrapheB.textContent = ratingsB;
            // $('#displayRatings').append(paragrapheC);
            // $('<button id="btnRate">Rate this restaurant</button>').appendTo('#displayRatings');

            // $('#saveRateBtn').on('click', function () {


            //     // restaurant.ratings.push(newRate);
            //     // // sessionStorage.setItem("ratings", newRate);
            //     // // sessionStorage.getItem("ratings");
            //     // let ratingsC = restaurant.ratings[2].comment
            //     // paragrapheC.textContent = ratingsC;
            //     // $('#modalRate').addClass('d-none').removeClass('d-block');
            //     // console.log(restaurant.ratings);
            // });

            // $('#review').val("");
            // closeModal()
        });
    }
}

function onSelectRestaurant(restaurant) {
    console.log("====")
    console.log(restaurant)
    const $restaurantName = $('.restaurant-name')
    $restaurantName.text(restaurant.restaurantName)
}

function onRateRestaurant() {
    const restaurantName = $('.restaurant-name').text()
    const selectedRestaurant = restaurants.filter(resto => resto.restaurantName === restaurantName)[0]

    const newRating = {
        stars: 2,
        comment: "C'est de la balle!!"
    }

    selectedRestaurant.ratings.push(newRating)

    console.log(selectedRestaurant.ratings)
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
    onRateRestaurant()
})

$(document).ready(function () {
    fetchData()
})