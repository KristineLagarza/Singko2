/* Editor: Marc Marron*/
src="https://unpkg.com/leaflet/dist/leaflet.js"

var map = L.map('map').setView([0, 0], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

navigator.geolocation.getCurrentPosition(function (position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    L.marker([10.054680118176899, 126.07106715440239]).addTo(map)
        .bindPopup('Alegria Beach').openPopup();

    map.setView([10.054680118176899, 126.07106715440239], 13); // Set map center to location
}, function (error) {
    console.error('Error getting geolocation:', error);
});


document.addEventListener("DOMContentLoaded", function() {
    var navigateButton = document.getElementById("navigateButton");
});


