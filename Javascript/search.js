// search.js
document.addEventListener('DOMContentLoaded', function () {
    var map = L.map('map');
    var routingControl; 

    // Check if the browser supports geolocation
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            // If geolocation is successful, center the map on the user's location
            map.setView([position.coords.latitude, position.coords.longitude], 13);

            // Add a marker at the user's location and use it as the current position marker
            var currentPosition = L.marker([position.coords.latitude, position.coords.longitude]).addTo(map)
                .bindPopup('Your current location');

            // Add a click event to the map to set the destination marker and route
            map.on('click', function (e) {
                console.log('Map clicked');
                // Remove the previous destination marker if it exists
                if (destinationMarker) {
                    map.removeLayer(destinationMarker);
                }

                // Remove the existing routing control if it exists
                if (routingControl) {
                    map.removeControl(routingControl);
                }

                // Add a new destination marker at the clicked location
                destinationMarker = L.marker(e.latlng).addTo(map)
                    .bindPopup('Your destination');

                // Use Leaflet Routing Machine for routing
                routingControl = L.Routing.control({
                    waypoints: [
                        L.latLng(currentPosition.getLatLng().lat, currentPosition.getLatLng().lng),
                        e.latlng
                    ],
                }).addTo(map);
                console.log('Routing control added');
            });
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

    var destinationMarker;
});



