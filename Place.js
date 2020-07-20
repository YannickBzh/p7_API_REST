const placeAdapter = googlePlace => {
    return {
        address: googlePlace.vicinity,
        id: googlePlace.id,
        placeId: googlePlace.place_id,
        lat: googlePlace.geometry.location.lat(),
        long: googlePlace.geometry.location.lng(),
        name: googlePlace.name,
        ratings: googlePlace.rating,
        type: "googlePlace"
    }
}


class Place {
    constructor(data) {
        this._address = data.address
        this._id = data.id
        this._placeId = data.placeId || null
        this._lat = data.lat
        this._long = data.long
        this._name = data.restaurantName || data.name
        this._ratings = data.ratings || []
        // If data type is defined = this is a data fetched from Google Places otherwise it is data contains within restos.json
        this._type = data.type ? data.type : "customPlace"
    }

    get address() {
        return this._address
    }

    set address(address) {
        this._address = address
    }

    get id() {
        return this._id
    }

    set id(id) {
        this._id = id
    }

    get placeId() {
        return this._placeId
    }

    get lat() {
        return this._lat
    }

    set lat(lat) {
        this._lat = lat
    }

    get long() {
        return this._long
    }

    set long(long) {
        this._long = long
    }

    get name() {
        return this._name
    }

    set name(name) {
        this._name = name
    }

    get picture() {
        return `https://maps.googleapis.com/maps/api/streetview?size=600x300&location=${this._lat},${this._long}&heading=151.78&pitch=-0.76&key=`
    }

    get ratings() {
        return this._ratings
    }

    set ratings(ratings) {
        this._ratings = ratings
    }

    get type() {
        return this._type
    }
}