src="https://unpkg.com/leaflet/dist/leaflet.js"

var map = L.map('map').setView([0, 0], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

navigator.geolocation.getCurrentPosition(function (position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    L.marker([8.6708, 126.1919]).addTo(map)
        .bindPopup('Your Location').openPopup();

    map.setView([8.6708, 126.1919], 13); // Set map center to user's location
}, function (error) {
    console.error('Error getting geolocation:', error);
});


document.addEventListener("DOMContentLoaded", function() {
    var navigateButton = document.getElementById("navigateButton");

    navigateButton.addEventListener("click", function() {
        // Redirect to cloud9map.html when the button is clicked
        window.location.href = "C:/Users/Coach Rai/Desktop/Singko2/Destinations";
    });
});


