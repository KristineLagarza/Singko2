src="https://unpkg.com/leaflet/dist/leaflet.js"

var map = L.map('map').setView([0, 0], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

navigator.geolocation.getCurrentPosition(function (position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    L.marker([9.861401404387276, 126.06300392556523]).addTo(map)
        .bindPopup('Your Location').openPopup();

    map.setView([9.861401404387276, 126.06300392556523], 13); // Set map center to user's location
}, function (error) {
    console.error('Error getting geolocation:', error);
});


document.addEventListener("DOMContentLoaded", function() {
    var navigateButton = document.getElementById("navigateButton");
});


