/*Editor: Allan ) Modified by Kristine)
Code represents the map API which you have to get geolocation of the destination by inputing the longitude and latitude*/

navigator.geolocation.getCurrentPosition(function (position) {
    var L = window.L;
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    var map = L.map('map').setView([latitude, longitude], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Â© OpenStreetMap contributors'
    }).addTo(map);

    L.marker([50.811184, 6.7919392]).addTo(map)
        .bindPopup('Kolon Germany').openPopup();

    L.marker([latitude, longitude]).addTo(map)
        .bindPopup('Your Location').openPopup();

    var destinationLocation = L.latLng(50.811184, 6.7919392);

    L.marker(destinationLocation).addTo(map);

    L.routing.control({
        waypoints: [
            L.latLng(latitude, longitude),
            destinationLocation
        ],
        routeWhileDragging: true,
    }).addTo(map);

    var destinations = [
        { lat: 50.811184, lon: 6.7919392, description: "Cologne is known for its joyous attitude and party spirit. The city is a matter of the heart, an emotion and an unfalteringly positive state of mind. At the root of this outlook are Cologne Carnival, kölsch beer and, of course, the cathedral." },
        // Add more destinations as needed
    ];

    // Loop through the destinations array and add markers with popups
    for (var i = 0; i < destinations.length; i++) {
        var destination = destinations[i];
        var marker = L.marker([destination.lat, destination.lon]).addTo(map);

        // Create a popup with the description
        var popupContent = "<p>" + destination.description + "</p>";

        // Bind the popup to the marker
        marker.bindPopup(popupContent);
    }


    var cities = [
        { name: "Cologne", lat: 50.9375, lon: 6.9603, description: "Cologne is known for its joyous attitude and party spirit." },
        { name: "Dusseldorf", lat: 51.2277, lon: 6.7735, description: "Dusseldorf is a vibrant city with a rich cultural scene." },
        { name: "Bonn", lat: 50.7374, lon: 7.0982, description: "Bonn is famous for its historic architecture and Beethoven's birthplace." },
        { name: "Frankfurt", lat: 50.1109, lon: 8.6821, description: "Frankfurt is a major financial hub and boasts a stunning skyline." },
        { name: "Berlin", lat: 52.5200, lon: 13.4050, description: "Berlin, the capital, is known for its history, art, and vibrant nightlife." },
        { name: "Munich", lat: 48.8566, lon: 11.1758, description: "Munich is famous for its beer gardens, museums, and historic architecture." },
        { name: "Berlin", lat: 52.5200, lon: 13.4050, description: "The capital known for its history, art, and vibrant nightlife." },
        { name: "Hamburg", lat: 53.5511, lon: 9.9937, description: "Germany's largest port city with a rich maritime history." },
        { name: "Stuttgart", lat: 48.7758, lon: 9.1829, description: "Known for automotive industry and cultural attractions." },
        { name: "Nuremberg", lat: 49.4474, lon: 11.0681, description: "Historic city with medieval architecture and cultural events." },
        { name: "Leipzig", lat: 51.3397, lon: 12.3731, description: "Cultural and economic hub with a rich musical heritage." },
        { name: "Hannover", lat: 52.3759, lon: 9.7320, description: "Capital of Lower Saxony with cultural and historical significance." },
        { name: "Dresden", lat: 51.0504, lon: 13.7373, description: "City of art and culture, known for its historic architecture." },
        { name: "Mannheim", lat: 49.4875, lon: 8.4660, description: "Known for its cultural institutions and museums." },
        { name: "Karlsruhe", lat: 49.0069, lon: 8.4037, description: "City with several museums and a vibrant cultural scene." },
        { name: "Baden-Baden", lat: 48.7583, lon: 8.2416, description: "Famous spa town with luxurious resorts and thermal baths." },
        { name: "Garmisch-Partenkirchen", lat: 47.4917, lon: 11.0950, description: "Alpine resort town known for winter sports and spa facilities." },
        { name: "Sylt", lat: 54.9069, lon: 8.3170, description: "Island with upscale resorts, beaches, and nature reserves." },
        { name: "Aachen", lat: 50.7753, lon: 6.0839, description: "Historical city with Aachen Cathedral, a UNESCO World Heritage Site." },
        { name: "Freiburg", lat: 47.9990, lon: 7.8421, description: "Beautiful city with Freiburg Minster, a medieval cathedral." },
        { name: "Regensburg", lat: 49.0140, lon: 12.1015, description: "Historic city with Regensburg Cathedral, an example of Gothic architecture." },
        { name: "Ulm", lat: 48.4011, lon: 9.9876, description: "Home to Ulm Minster, the tallest church in the world." },

        { name: "Cologne Cathedral", lat: 50.9413, lon: 6.9585, description: "A famous Gothic cathedral in Cologne." },
        { name: "St. Peter's Church", lat: 48.8566, lon: 2.3522, description: "An ancient church in Paris known for its history." },
        { name: "Vatican Museums", lat: 41.9022, lon: 12.4534, description: "A complex of museums and galleries in Vatican City." },
        { name: "Louvre Museum", lat: 48.8606, lon: 2.3376, description: "The world's largest art museum and a historic monument in Paris." },
        { name: "Sistine Chapel", lat: 41.9029, lon: 12.4534, description: "A chapel in Vatican City known for Michelangelo's ceiling." },
        { name: "Notre-Dame Cathedral", lat: 48.8530, lon: 2.3499, description: "A medieval Catholic cathedral in Paris." },
    ];



    // Loop through the cities array and add markers with popups
    for (var i = 0; i < cities.length; i++) {
        var city = cities[i];
        var marker = L.marker([city.lat, city.lon]).addTo(map);

        // Create a popup with the city name and description
        var popupContent = "<strong>" + city.name + "</strong><br>" + city.description;

        // Bind the popup to the marker
        marker.bindPopup(popupContent);

        // Add a click event listener to the marker
        marker.on('click', function (e) {
            var destinationLatLng = e.latlng;

            // Calculate route and display distance
            L.Routing.control({
                waypoints: [
                    L.latLng(latitude, longitude),
                    destinationLatLng
                ],
                routeWhileDragging: true,
            }).addTo(map);

            // Compute and display distance
            var distance = map.distance([latitude, longitude], destinationLatLng);
            alert("Distance to " + e.target.getPopup().getContent() + ": " + distance.toFixed(2) + " meters");
        });
    }


    L.map('map', { doubleClickZoom: false }).locate({ setView: true, maxZoom: 16 });
}, function (error) {
    console.error('Error getting geolocation:', error);
});

