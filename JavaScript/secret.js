/* Editor: Marc Marron*/
src="https://unpkg.com/leaflet/dist/leaflet.js"

var map = L.map('map').setView([0, 0], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

navigator.geolocation.getCurrentPosition(function (position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    L.marker([10.044302084869768, 126.04327895254983]).addTo(map)
        .bindPopup('Secret Beach').openPopup();

    map.setView([10.044302084869768, 126.04327895254983], 13); // Set map center location
}, function (error) {
    console.error('Error getting geolocation:', error);
});


document.addEventListener("DOMContentLoaded", function() {
    var navigateButton = document.getElementById("navigateButton");
});


