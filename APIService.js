class APIService {
    constructor(url) {
        this._url = url
    }

    fetchData() {
        return fetch(this._url, { mode: 'no-cors' })
        .then(res => {
            return res.json();
        })
        .catch(function (err) {
            console.log('Problème');
            console.log(err);
        })
    }
}