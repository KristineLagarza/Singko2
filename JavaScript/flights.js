 /**
  *  Author/s: ODENEIL BELEN
  */ 
  
  // Get references to the relevant elements
const userInputForm = document.getElementById("userInputForm");
const departureDateInput = document.getElementById("departureDate");

// Add an event listener to the "Submit" button
// Get the chosen date from the input field
// Parse the XML data obtained from the API to a DOM object
// Extract flight details and convert some information to be readable by users
// Displays the flight information 

document.getElementById("submitButton").addEventListener("click", function() {
    
    const chosenDate = departureDateInput.value;
    const newChosenDate = chosenDate.replace(/-/g, '');
    console.log(newChosenDate);
    const url = `https://timetable-lookup.p.rapidapi.com/TimeTable/MNL/IAO/${newChosenDate}/?7Day=Y`;

    fetch(url, {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'bec3f6579dmshed7a99e8de6aab5p1a23bejsnc1b1f3d4ce26',
      'X-RapidAPI-Host': 'timetable-lookup.p.rapidapi.com'
    }
  })
    .then(response => {
      if (response.ok) {
        return response.text();
      } else {
        throw new Error('Network response was not ok');
      }
    })
    .then(result => {
           
           const parser = new DOMParser();
           const xmlDoc = parser.parseFromString(result, 'text/xml');
       
           
           const flightDetails = xmlDoc.querySelectorAll('FlightDetails');
           const flightInfo = [];
       
           flightDetails.forEach(flightDetail => {
             
             let daysOfFlight = flightDaysToDayOfWeek(flightDetail.getAttribute('FLSFlightDays'));
             let tripInfo = convertTripInfo(flightDetail.getAttribute('TotalTripTime'), flightDetail.getAttribute('TotalFlightTime'), flightDetail.getAttribute('FLSDepartureDateTime'), flightDetail.getAttribute('FLSArrivalDateTime'));
             let kmInfo = milesToKilometers(flightDetail.getAttribute('TotalMiles'));
             let departureInfo = extractDateAndTime(flightDetail.getAttribute('FLSDepartureDateTime'));
             let arrivalInfo = extractDateAndTime(flightDetail.getAttribute('FLSArrivalDateTime'));
     
             const flight = {
               TotalFlightTime: tripInfo.flightDuration,
               TotalMiles: kmInfo.toFixed(2),
               TotalTripTime: tripInfo.tripDuration,
               DepartureDateTime: departureInfo.date + ' @ ' + tripInfo.departureTime,
               DepartureCode: flightDetail.getAttribute('FLSDepartureCode'),
               DepartureName: flightDetail.getAttribute('FLSDepartureName'),
               ArrivalDateTime: arrivalInfo.date + ' @ ' + tripInfo.arrivalTime,
               ArrivalCode: flightDetail.getAttribute('FLSArrivalCode'),
               ArrivalName: flightDetail.getAttribute('FLSArrivalName'),
               FlightType: flightDetail.getAttribute('FLSFlightType'),
               FlightDays: daysOfFlight,
             };
       
             flightInfo.push(flight);
           });
       
           
           const flightInfoDiv = document.getElementById('flights-container');
           flightInfo.forEach((flight, index) => {
             flightInfoDiv.innerHTML += `
               <div class="flight-info">
                 <h2>Flight ${index + 1}</h2>
                 <h3>Departure</h3>
                 <p>Departure Date/Time: ${flight.DepartureDateTime}</p>
                 <p>Departure Name: ${flight.DepartureName}</p>
                 <p>Departure Code: ${flight.DepartureCode}</p>
                 <h3>Arrival</h3>
                 <p>Arrival Date/Time: ${flight.ArrivalDateTime}</p>
                 <p>Arrival Code: ${flight.ArrivalCode}</p>
                 <p>Arrival Name: ${flight.ArrivalName}</p>
                 <br><p>Total Flight Time: ${flight.TotalFlightTime}</p>
                 <p>Total Trip Time: ${flight.TotalTripTime}</p>
                 <p>Flight Type: ${flight.FlightType}</p>
               </div>
             `;
           });
           window.scrollTo(0,document.body.scrollHeight);
    })
    .catch(error => {
      console.error(error);
    });
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
    
    // Regular expression to match time in the format PT2H30M
    // Extract hours and minutes from the matched regex groups
    function convertTime(time) {
        
        const timeRegex = /PT(\d+)H(\d+)M/;
        const match = time.match(timeRegex);
    
        let hours = 0;
        let minutes = 0;
    
        if (match) {
            
            hours = parseInt(match[1]);
            minutes = parseInt(match[2]);
        }
    
        return `${hours} hours and ${minutes} minutes`;
    }
    
    // Parse departure and arrival datetimes
    function convertTripInfo(totalTripTime, totalFlightTime, departureDateTime, arrivalDateTime) {
        
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
        
        const kilometers = miles * 1.60934;
        return kilometers;
    }

    // Extract the matched date and time
    function extractDateAndTime(dateTimeString) {
      const dateTimeRegex = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})$/;
      const match = dateTimeString.match(dateTimeRegex);
  
      if (match) {
          
          const extractedDateTime = match[1];
          const [date, time] = extractedDateTime.split('T');
  
          return {
              date,
              time
          };
      }
  
      return null; 
  }
    
