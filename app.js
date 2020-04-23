
// STOCKE LES RESTAURANTS DANS UNE VARIABLE
let restaurants = [
    ['Masaniello', 44.839191, -0.571334, 4],
    ['Mangez-moi', 44.834182, -0.573081, 5],
    ['Mama Shelter', 44.839982, -0.577416, 3],
    ['La brasserie Bordelaise', 44.841245, -0.573056, 2],
    ['Le Quatrième Mur', 44.842738, -0.574087, 1]
];


// AFFICHE LES MARKERS DES RESTAURANTS
function setMarkers(map) {
    let shape = {
        coords: [1, 1, 1, 20, 18, 20, 18, 1],
        type: 'poly'
    };
    for (let i = 0; i < restaurants.length; i++) {
        let restaurant = restaurants[i];
        let marker = new google.maps.Marker({
            position: { lat: restaurant[1], lng: restaurant[2] },
            map: map,
            shape: shape,
            title: restaurant[0],
            zIndex: restaurant[3]
        });
        marker.addListener('click', function() {
            console.log(restaurants[1])
            console.log(marker.title)
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
        
        for (let i = 0; i < restos.length; i++) {
            //let restoNames = restos[i].restaurantName
            let resto1Ratings = restos[0].ratings
            
            console.log(resto1Ratings)
        }
        setMarkers(map);
    })
    .catch(function () {
        console.log('Problème');
    })

