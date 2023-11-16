// search.js
document.addEventListener('DOMContentLoaded', function () {
    var map = L.map('map');

    // Check if the browser supports geolocation
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            // If geolocation is successful, center the map on the user's location
            map.setView([position.coords.latitude, position.coords.longitude], 13);

            // Add a marker at the user's location
            L.marker([position.coords.latitude, position.coords.longitude]).addTo(map)
                .bindPopup('Your current location');
        }, function (error) {
            console.error('Error getting geolocation:', error.message);
            // If there's an error, fallback to a default location
            map.setView([10.3098, 123.8938], 13);
        });
    } else {
        // If geolocation is not supported, fallback to a default location
        map.setView([10.3098, 123.8938], 13);
    }

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
});