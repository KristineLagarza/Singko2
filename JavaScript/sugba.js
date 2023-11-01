/*Editor: Allan
Code represents the map API which you have to get geolocation of the destination by inputing the longitude and latitude*/
src="https://unpkg.com/leaflet/dist/leaflet.js"

var map = L.map('map').setView([0, 0], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

navigator.geolocation.getCurrentPosition(function (position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    L.marker([9.86876493, 125.96919616]).addTo(map)
        .bindPopup('Your Location').openPopup();

    map.setView([9.7651, 126.1679], 13); // Set map center to location
}, function (error) {
    console.error('Error getting geolocation:', error);
});




