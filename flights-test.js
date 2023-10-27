//to be modified or deleted
function submitUserInput() {
    // Get user input values
    const departureDate = document.getElementById('departureDate').value;
    const flightType = document.getElementById('flightType').value;
  
    // displays the departure date and flight type of user
    const flightInfoDiv = document.getElementById('flightInfo');
    flightInfoDiv.innerHTML = `User Input:<br>Departure Date: ${departureDate}<br>Flight Type: ${flightType}`;
  }
  
  document.getElementById('submitButton').addEventListener('click', submitUserInput);
  

  // fetch the data from the API
  // 'flights.txt' will be replaced with the API URL from TimeTable Lookup
  fetch('flights.txt')
    .then(response => response.text())
    .then(xmlString => {
      // Parse the XML string to a DOM object
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
  
      // Extract flight details
      const flightDetails = xmlDoc.querySelectorAll('FlightDetails');
      const flightInfo = [];
  
      flightDetails.forEach(flightDetail => {
        // convert some information to be readable by users
        let daysOfFlight = flightDaysToDayOfWeek(flightDetail.getAttribute('FLSFlightDays'));
        let tripInfo = convertTripInfo(flightDetail.getAttribute('TotalTripTime'), flightDetail.getAttribute('TotalFlightTime'), flightDetail.getAttribute('FLSDepartureDateTime'), flightDetail.getAttribute('FLSArrivalDateTime'));
        let kmInfo = milesToKilometers(flightDetail.getAttribute('TotalMiles'));

        const flight = {
          TotalFlightTime: tripInfo.flightDuration,
          TotalMiles: kmInfo.toFixed(2),
          TotalTripTime: tripInfo.tripDuration,
          DepartureDateTime: tripInfo.departureTime,
          DepartureCode: flightDetail.getAttribute('FLSDepartureCode'),
          DepartureName: flightDetail.getAttribute('FLSDepartureName'),
          ArrivalDateTime: tripInfo.arrivalTime,
          ArrivalCode: flightDetail.getAttribute('FLSArrivalCode'),
          ArrivalName: flightDetail.getAttribute('FLSArrivalName'),
          FlightType: flightDetail.getAttribute('FLSFlightType'),
          FlightLegs: flightDetail.getAttribute('FLSFlightLegs'),
          FlightDays: daysOfFlight,
        };
  
        // You can add more attributes as needed
  
        flightInfo.push(flight);
      });
  
      // Display flight information
      const flightInfoDiv = document.getElementById('flightInfo');
      flightInfoDiv.innerHTML = '<h2>Flight Information</h2>';
      flightInfo.forEach((flight, index) => {
        flightInfoDiv.innerHTML += `
          <div>
            <h3>Flight ${index + 1}</h3>
            <p>Total Flight Time: ${flight.TotalFlightTime}</p>
            <p>Total Kilometers: ${flight.TotalMiles}</p>
            <p>Total Trip Time: ${flight.TotalTripTime}</p>
            <p>Departure Date/Time: ${flight.DepartureDateTime}</p>
            <p>Departure Code: ${flight.DepartureCode}</p>
            <p>Departure Name: ${flight.DepartureName}</p>
            <p>Arrival Date/Time: ${flight.ArrivalDateTime}</p>
            <p>Arrival Code: ${flight.ArrivalCode}</p>
            <p>Arrival Name: ${flight.ArrivalName}</p>
            <p>Flight Type: ${flight.FlightType}</p>
            <p>Flight Legs: ${flight.FlightLegs}</p>
            <p>Flight Days: ${flight.FlightDays}</p>
          </div>
        `;
      });
    })
    .catch(error => {
      console.error('Error fetching or parsing XML:', error);
    });
  
    function flightDaysToDayOfWeek(flightDays) {
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        flightDaysArray = [];
        for(let i = 0; i < flightDays.length; i++){
            const char = flightDays.charAt(i);
            if(!isNaN(char)){
                const dayNumber = parseInt(char);
                if(dayNumber >= 0 && dayNumber <= daysOfWeek.length){
                    flightDaysArray.push(daysOfWeek[dayNumber - 1]);
                }
            }
        }
        return flightDaysArray;
    }
    
    function convertTime(time) {
        // Regular expression to match time in the format PT2H30M
        const timeRegex = /PT(\d+)H(\d+)M/;
        const match = time.match(timeRegex);
    
        let hours = 0;
        let minutes = 0;
    
        if (match) {
            // Extract hours and minutes from the matched regex groups
            hours = parseInt(match[1]);
            minutes = parseInt(match[2]);
        }
    
        return `${hours} hours and ${minutes} minutes`;
    }
    
    function convertTripInfo(totalTripTime, totalFlightTime, departureDateTime, arrivalDateTime) {
        // Parse departure and arrival datetimes
        const departureTime = new Date(departureDateTime);
        const arrivalTime = new Date(arrivalDateTime);
    
        const tripDurationStr = convertTime(totalTripTime);
        const flightDurationStr = convertTime(totalFlightTime);
        const departureTimeStr = departureTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const arrivalTimeStr = arrivalTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
        return {
            tripDuration: tripDurationStr,
            flightDuration: flightDurationStr,
            departureTime: departureTimeStr,
            arrivalTime: arrivalTimeStr,
        };
    }
    
     //conversion of miles(mi) to kilometers(km)
    function milesToKilometers(miles) {
        // 1 mile is approximately equal to 1.60934 kilometers
        const kilometers = miles * 1.60934;
        return kilometers;
    }
    
