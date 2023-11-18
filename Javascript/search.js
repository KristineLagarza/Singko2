// search.js
document.addEventListener('DOMContentLoaded', function () {
    var map = L.map('map1');
    var destinationMarker;
    var destinationLongitude;
    var destinationLatitude;

    // Create a warning div
    var warningDiv = document.createElement('div');
    warningDiv.id = 'warning';
    warningDiv.style.position = 'absolute';
    warningDiv.style.top = '10px';
    warningDiv.style.left = '10px';
    warningDiv.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
    warningDiv.style.color = '#fff';
    warningDiv.style.padding = '10px';
    warningDiv.style.display = 'none'; // Initially hide the warning

    document.body.appendChild(warningDiv);

    // Function to update the warning message
    function updateWarning(message) {
        warningDiv.textContent = message;
        warningDiv.style.display = 'block';
    }

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
                // Remove the warning when the user clicks on the map
                warningDiv.style.display = 'none';

                // Remove the previous destination marker if it exists
                if (destinationMarker) {
                    map.removeLayer(destinationMarker);
                }

                // Remove existing polylines
                map.eachLayer(function (layer) {
                    if (layer instanceof L.Polyline) {
                        map.removeLayer(layer);
                    }
                });

                // Add a new destination marker at the clicked location
                destinationMarker = L.marker(e.latlng).addTo(map)
                    .bindPopup('Your destination')
                    .openPopup(); // Open the popup immediately

                console.log(destinationMarker);

                destinationLatitude = e.latlng.lat;
                destinationLongitude = e.latlng.lng;

                // Ask for confirmation before adding the route
                // var confirmRoute = window.confirm('Do you want to proceed with the route?');

                // Add a polyline from the current position to the destination
                var latlngs = [
                    [currentPosition.getLatLng().lat, currentPosition.getLatLng().lng],
                    [destinationLatitude, destinationLongitude]
                ];
                var polyline = L.polyline(latlngs, { color: 'blue' }).addTo(map);

                geocoding(position.coords.latitude, position.coords.longitude, destinationLatitude, destinationLongitude);

            });
        }, function (error) {
            // Show a warning if there's an error getting geolocation
            updateWarning('Error getting geolocation. Please choose a location on the map.');
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





// Geocoding
// Find address or place by latitude and longitude
function geocoding(currentLat, currentLng, destinationLat, destinationLng) {
    // Geocoding for current position
    const currentUrl = `https://forward-reverse-geocoding.p.rapidapi.com/v1/reverse?lat=${currentLat}&lon=${currentLng}&accept-language=en&polygon_threshold=0.0`;
    
    // Geocoding for destination
    const destinationUrl = `https://forward-reverse-geocoding.p.rapidapi.com/v1/reverse?lat=${destinationLat}&lon=${destinationLng}&accept-language=en&polygon_threshold=0.0`;

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '652e1212b4msh02c7ed11051a093p1e77e2jsn34016fc1b090',
            'X-RapidAPI-Host': 'forward-reverse-geocoding.p.rapidapi.com'
        }
    };


    
    // Geocode for current position
    const currentGeocodingPromise = fetch(currentUrl, options)
        .then(response => response.json())
        .then(result => {
            const currentCountry = result.address.country_code;
            console.log('Current Position Country:', currentCountry);
            return currentCountry;
        })
        .catch(error => {
            console.error('Current Position Geocoding Error:', error);
            throw error;
        });

    // Geocode for destination
    const destinationGeocodingPromise = fetch(destinationUrl, options)
        .then(response => response.json())
        .then(result => {
            const destinationCountry = result.address.country_code;
            console.log('Destination Country:', destinationCountry);
            return destinationCountry;
        })
        .catch(error => {
            console.error('Destination Geocoding Error:', error);
            throw error;
        });

    Promise.all([currentGeocodingPromise, destinationGeocodingPromise])
        .then(([currentCountry, destinationCountry]) => {
            return performSearchWithDelay(currentCountry, destinationCountry);
        })
        .catch(error => {
            console.error('Error in geocoding promises:', error);
        });
}

function populateDropdown(selectElement, options) {
    // Clear existing options
    selectElement.innerHTML = '';

    // Add new options
    options.forEach(option => {
        const optionElement = document.createElement('option');
        
        // Check if the option is an object with 'value' and 'text' properties
        if (typeof option === 'object' && 'value' in option && 'text' in option) {
            optionElement.value = option.value;
            optionElement.textContent = option.text;
        } else {
            // If not, assume it's a simple string and use it for both value and text
            optionElement.value = option;
            optionElement.textContent = option;
        }

        selectElement.appendChild(optionElement);
    });
}

let fromDropdownPopulated = false;

function searchAirportByLocation(location, callback) {
    const url = `https://timetable-lookup.p.rapidapi.com/airports/countries/${location}/`;

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'cbbf20c4eemsha75a0fa1baeb91cp1817fajsncfeb7ffc3bfe',
            'X-RapidAPI-Host': 'timetable-lookup.p.rapidapi.com',
        },
    };

    

    fetch(url, options)
        .then(response => response.text())
        .then(result => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(result, 'text/xml');
            const airports = xmlDoc.getElementsByTagName('Airport');
            const airportData = Array.from(airports).map(airport => ({
                iataCode: airport.getAttribute('IATACode'),
                name: airport.getAttribute('Name')
            }));
            callback(airportData);

            // Populate the "From" and "To" dropdowns with both iataCode and name
            const fromDropdown = document.getElementById('from');
            const toDropdown = document.getElementById('to');

            const dropdownOptions = airportData.map(airport => ({
                value: airport.iataCode,
                text: `${airport.iataCode} - ${airport.name}`
            }));

            if (!fromDropdownPopulated) {
                populateDropdown(fromDropdown, dropdownOptions);
                fromDropdownPopulated = true; // Set the flag to true after populating the dropdown
            }
            populateDropdown(toDropdown, dropdownOptions);
        })
        .catch(error => {
            console.error('Airport Search Error:', error);
        });
}

// Function for current location
function searchCurrentAirport(currentLocation) {
    searchAirportByLocation(currentLocation, (result) => {
        const iataCodes = result.map(airport => airport.iataCode);
        const names = result.map(airport => airport.name);

        console.log('Current Position Airport IATACodes:', iataCodes);
        console.log('Current Position Airport Names:', names);
    });
}

// Function for destination location
function searchDestinationAirport(destinationLocation) {
    searchAirportByLocation(destinationLocation, (result) => {
        const iataCodes = result.map(airport => airport.iataCode);
        const names = result.map(airport => airport.name);

        console.log('Destination Airport IATACodes:', iataCodes);
        console.log('Destination Airport Names:', names);
    });
}


function searchFlights(source, destination, departureDate) {
    var srcIATACode = source.value.split(' ')[0];
    var destIATACode = destination.value.split(' ')[0];

    const url = `https://tripadvisor16.p.rapidapi.com/api/v1/flights/searchFlights?sourceAirportCode=${srcIATACode}&destinationAirportCode=${destIATACode}&date=${departureDate}&itineraryType=ONE_WAY&sortOrder=PRICE&numAdults=1&numSeniors=0&classOfService=ECONOMY&currencyCode=PHP`;

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '126a99cce3msh20cdc81fe3b382bp104ddajsnab2e44ce7771',
            'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com'
        }
    };

    fetch(url, options)
    .then(response => response.json())
    .then(result => {
        console.log(result);
      var flights = result.data.flights;
      var flightDetailsHtml = ``;
  
      flightDetailsHtml += `<p>${flights.length} Flights</p>`;
  
      flights.forEach((flight, index) => {


        const amount = flight.purchaseLinks[0].totalPrice.text;

        flightDetailsHtml += `<div class="flight-details" id="flight-${index + 1}">`;
        flightDetailsHtml += `<h3>${flight.segments[0].legs[0].departureDateTime.text} -> ${flight.segments[0].legs[0].arrivalDateTime.text}</h3>`;
        flightDetailsHtml += `<h4>${source.text} -> ${destination.text}</h4>`;
        flightDetailsHtml += `<p>Duration: ${flight.segments[0].layovers[0].durationInMinutes.text} Minutes</p>`;
  
        // Accessing purchaseLinks array
        flightDetailsHtml += `<p>Purchase Links:</p>`;
        if (Array.isArray(flight.purchaseLinks)) {
          flight.purchaseLinks.forEach((purchaseLink, purchaseIndex) => {
            flightDetailsHtml += `<p class="purchase-link">Purchase Link ${purchaseIndex + 1}: ${purchaseLink.text}</p>`;
          });
        } else {
          flightDetailsHtml += `<p class="purchase-link">No purchase links available</p>`;
        }
  
        flightDetailsHtml += `</div>`;
        flightDetailsHtml += `<hr>`;
      });
  
      // Update the "place-of-interest" div with the generated flight details HTML
      document.getElementById('place-of-interest').innerHTML = flightDetailsHtml;
    })
    .catch(error => {
      console.error(error);
    });
  
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function performSearchWithDelay(currentCountry, destinationCountry) {

    searchCurrentAirport(currentCountry);
    await sleep(1500); // Sleep for another 1000 milliseconds
    searchDestinationAirport(destinationCountry);
}

function validateForm() {
    // Check if the "From" and "To" dropdowns have options
    var fromDropdown = document.getElementById('from');
    var toDropdown = document.getElementById('to');
    var departureDateInput = document.getElementById('departureDate');

    if (fromDropdown.options.length === 0 || toDropdown.options.length === 0) {
        alert('Please select first a location in the map.');
        return false;
    }

    // Get the selected values from the dropdowns
    var selectedFrom = fromDropdown.options[fromDropdown.selectedIndex]; 
    var selectedTo = toDropdown.options[toDropdown.selectedIndex]; 

    // Get the value of the departure date
    var departureDate = departureDateInput.value;

    // Call searchFlights function with selected values
    searchFlights(selectedFrom, selectedTo, departureDate);

    return true;
}

function minutesToHHMM(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}H ${remainingMinutes}M`;
  }
