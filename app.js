
// AFFICHE LES MARKERS DES RESTAURANTS
function setMarkers(map, data) {
    let shape = {
        coords: [1, 1, 1, 20, 18, 20, 18, 1],
        type: 'poly'
    };

    for (let i = 0; i < data.length; i++) {
        let restaurant = data[i];
        let marker = new google.maps.Marker({
            position: { lat: restaurant.lat, lng: restaurant.long },
            map: map,
            shape: shape,
            title: restaurant.restaurantName
        });
        marker.addListener('click', function() {
            let restaurantName = restaurant.restaurantName
            let ratingsA = restaurant.ratings[0].comment;
            let ratingsB = restaurant.ratings[1].comment;
            let p = document.createElement("p");
            let p2 = document.createElement("p");
            document.getElementById('displayRatings').innerHTML = restaurantName;
            document.getElementById('displayRatings').appendChild(p);
            p.textContent = ratingsA;
            document.getElementById('displayRatings').appendChild(p2);
            p2.textContent = ratingsB;
          });
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


fetch('public/restos.json', {mode: 'no-cors'})
    .then(function (res) {
        return res.json();
    })
    .then(restos => {
        setMarkers(map, restos);
    })
    .catch(function () {
        console.log('Problème');
    })