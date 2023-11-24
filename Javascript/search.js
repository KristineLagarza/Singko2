// search.js
var localAirportLat;
var localAirportLong;
var nearAP;
var firstIATACode;
var secondIATACode;
var departureDateValue;
var placeValue;

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

            getNearestAirport(position.coords.latitude, position.coords.longitude).then(airportCodes => {
                getMetroCode(airportCodes).then(matchingMetroCodes => {
                    firstIATACode = matchingMetroCodes;
                    // Get latitude and longitude for matching metro codes
                    extractLatLongByAirportCode(matchingMetroCodes, nearAP).then(latLongArray => {
                        latLongArray.forEach(coords => {
                            L.marker([coords.latitude, coords.longitude]).addTo(map)
                                .bindPopup('Airport/Metro Location');
                                
                        });
                        // Draw a route along the road
                        drawRoute(position.coords.latitude, position.coords.longitude, latLongArray[0].latitude, latLongArray[0].longitude);
                    });
                });
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

    function drawRoute(startLat, startLng, destLat, destLng, color) {
        const waypoints = [
            L.latLng(startLat, startLng),
            L.latLng(destLat, destLng)
        ];
    
        const route = L.Routing.control({
            waypoints: waypoints,
        }).addTo(map);
    
        // Draw a broken line
        const pattern = {
            color: color,
            weight: 2,
            opacity: 0.5,
            dashArray: '10, 10'
        };
    
        const brokenLinePoints = [
            [startLat, startLng],
            [destLat, destLng]
        ];
    
        L.polyline(brokenLinePoints, pattern).addTo(map);
    
        return route;
    }
    
    var routeForm = document.getElementById('routeForm');
    var firstRouteControl;
    var secondRouteControl;
    
    routeForm.addEventListener('submit', function (event) {
        event.preventDefault();
    
        // Clear existing controls
        if (firstRouteControl) {
            map.removeControl(firstRouteControl);
        }
        if (secondRouteControl) {
            map.removeControl(secondRouteControl);
        }
    
        var placeInput = document.getElementById('place');
        placeValue = placeInput.value;
        var departureDateInput = document.getElementById('departureDate');
        departureDateValue = departureDateInput.value;
    
        forwardGeocoding(placeValue)
            .then(([lat, lon]) => {
                getNearestAirport(lat, lon).then(airportCodes => {
                    getMetroCode(airportCodes).then(matchingMetroCodes => {
                        secondIATACode = matchingMetroCodes;
                        extractLatLongByAirportCode(matchingMetroCodes, nearAP).then(latLongArray => {
                            latLongArray.forEach(coords => {
                                L.marker([coords.latitude, coords.longitude]).addTo(map)
                                    .bindPopup('Airport/Metro Location');
                            });
    
                            // Draw the broken line from the first airport to the second airport
                            drawRoute(lat, lon, latLongArray[0].latitude, latLongArray[0].longitude, 'blue');
    
                            if (placeValue !== '' && departureDateValue !== '') {
                                getFlights(firstIATACode, secondIATACode, departureDateValue);
                            } else {
                                alert('Please enter both place and departure date.');
                            }
                        });
                    });
                });
            })
            .catch(error => {
                console.error('There was an error:', error);
            });
    });
    
});

/* -------------------------------------- Neareset Airport / IATA Code ----------------------------------------------------*/

// Returns the nearest airports for a given latitude and longitude
function getNearestAirport(latitude, longitude) {
    const url = `https://timetable-lookup.p.rapidapi.com/airports/nearest/${latitude}/${longitude}/`;
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'bda103751amshf2c573250029a10p141eb3jsn966f1108f2f6',
        'X-RapidAPI-Host': 'timetable-lookup.p.rapidapi.com'
      }
    };
    
    return fetch(url, options)
    .then(response => response.text())
    .then(xmlString => {
        nearAP = xmlString;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
        const airports = xmlDoc.getElementsByTagName('Airport');
        const IATACodes = [];

        for (let i = 0; i < airports.length; i++) {
            const IATACode = airports[i].getAttribute('IATACode');
            IATACodes.push(IATACode);
        }
        return IATACodes;
    })
    .catch(error => {
        console.error('Airport Search Error:', error);
        return [];
    });
  }

/* -------------------------------------- Metro IATA codes ----------------------------------------------------*/

// Get the IATA Code of the City
async function getMetroCode(airportCodes) {
    
    await sleep(1500);
    const url = 'https://timetable-lookup.p.rapidapi.com/airports/metros/';
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'bda103751amshf2c573250029a10p141eb3jsn966f1108f2f6',
            'X-RapidAPI-Host': 'timetable-lookup.p.rapidapi.com'
        }
    };

    return fetch(url, options)
        .then(response => response.text())
        .then(xmlString => {
            
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

            // Extract IATACodes from Metro
            const metros = xmlDoc.getElementsByTagName('Metro');

            for (let i = 0; i < metros.length; i++) {
                const IATACode = metros[i].getAttribute('IATACode');

                if (airportCodes.includes(IATACode)) {
                    return IATACode; // Return the first matching code
                }
            }

            return null; 
        })
        .catch(error => {
            console.error('Metro Search Error:', error);
            return null;
        });
}
  
// Get the name of the City
    function getMetroName(city){
        const url = 'https://timetable-lookup.p.rapidapi.com/airports/metros/';
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'bda103751amshf2c573250029a10p141eb3jsn966f1108f2f6',
                'X-RapidAPI-Host': 'timetable-lookup.p.rapidapi.com'
            }
    };

    fetch(url, options)
    .then(response => response.text())
    .then(xmlString => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

        // Extract Name from Metro
        const metros = xmlDoc.getElementsByTagName('Metro');
        for (let i = 0; i < metros.length; i++) {
        const name = metros[i].getAttribute('Name');
        }
    })
    .catch(error => {
        console.error('Airport Search Error:', error);
    });
  }

  
/* -------------------------------------- GEOCODING ----------------------------------------------------*/

  //Turn an address into latitude and longitude (e.g. to display on a map) by schematic input.
    function forwardGeocoding(city) {
        const url = `https://forward-reverse-geocoding.p.rapidapi.com/v1/forward?format=xml&city=${city}&accept-language=en&polygon_threshold=0.0`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'bec3f6579dmshed7a99e8de6aab5p1a23bejsnc1b1f3d4ce26',
                'X-RapidAPI-Host': 'forward-reverse-geocoding.p.rapidapi.com'
            }
        };
    
        return fetch(url, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }
                return response.text();
            })
            .then(xmlString => {
                // Parse the XML string to an XML document
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    
                // Extract latitude and longitude
                const lat = xmlDoc.querySelector('place').getAttribute('lat');
                const lon = xmlDoc.querySelector('place').getAttribute('lon');
    
                // Return the latitude and longitude as an array
                return [lat, lon];
            });
    }    

  // Find address or place by latitude and longitude
  function reverseGeocoding(latitude, longitude){
    const url = `https://forward-reverse-geocoding.p.rapidapi.com/v1/reverse?lat=${latitude}&lon=${longitude}&accept-language=en&polygon_threshold=0.0`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'bec3f6579dmshed7a99e8de6aab5p1a23bejsnc1b1f3d4ce26',
            'X-RapidAPI-Host': 'forward-reverse-geocoding.p.rapidapi.com'
        }
    };

    fetch(url, options)
        .then(response => response.text())
        .then(result => {
            console.log(result);
        })
        .catch(error => {
            console.error(error);
        });
  }

  async function extractLatLongByAirportCode(code, xmlString) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    const airports = xmlDoc.getElementsByTagName('Airport');
    const latLongArray = [];

    for (let i = 0; i < airports.length; i++) {
        const airportCode = airports[i].getAttribute('IATACode');

        if (airportCode === code) {
            const latitude = airports[i].getAttribute('Latitude');
            const longitude = airports[i].getAttribute('Longitude');

            latLongArray.push({ latitude, longitude });
            break;
        }
    }

    return latLongArray;
}

function getFlights(src, dest, departureDate) {
    const url = `https://tripadvisor16.p.rapidapi.com/api/v1/flights/searchFlights?sourceAirportCode=${src}&destinationAirportCode=${dest}&date=${departureDate}&itineraryType=ONE_WAY&sortOrder=PRICE&numAdults=1&numSeniors=0&classOfService=ECONOMY&currencyCode=USD`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'bec3f6579dmshed7a99e8de6aab5p1a23bejsnc1b1f3d4ce26',
            'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com'
        }
    };

    fetch(url, options)
    .then(response => response.json()) // Parse response as JSON
    .then(data => {
        // Extract necessary information
        const flights = data.data.flights;

        // Display the extracted flight information
        const flightInfoContainer = document.getElementById('place-of-interest');
        flightInfoContainer.innerHTML = '<h2>Flight Information</h2>';

        flights.forEach((flight, index) => {
            const totalPrice = flight.purchaseLinks[0].totalPrice;
            const flightNumber = flight.segments[0].legs[0].flightNumber;
            const leg = flight.segments[0].legs[0];

            // Create a container for each flight
            const flightContainer = document.createElement('div');
            flightContainer.classList.add('flight-container');

            flightContainer.innerHTML = `
                <h3>Flight ${index + 1}</h3>
                <p>Total Price: PHP ${totalPrice}</p>
                <p>Flight Number: ${flightNumber}</p>
                <p>Origin: ${leg.originStationCode}</p>
                <p>Destination: ${leg.destinationStationCode}</p>
                <p>Departure Time: ${leg.departureDateTime}</p>
                <p>Arrival Time: ${leg.arrivalDateTime}</p>
                <p>Airlines: ${leg.marketingCarrier.displayName}</p>
            `;

            // Append the flight container to the main container
            flightInfoContainer.appendChild(flightContainer);
        });
    })
    .catch(error => {
        console.error(error);
    });
}



  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
