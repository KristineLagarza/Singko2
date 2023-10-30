//to be modified or deleted
// function submitUserInput() {
//     // Get user input values
//     const departureDate = document.getElementById('departureDate').value;
  
//     // displays the departure date and flight type of user
//     const flightInfoDiv = document.getElementById('flightInfo');
//   }
  
//   document.getElementById('submitButton').addEventListener('click', submitUserInput);
  
  // Get references to the relevant elements
const userInputForm = document.getElementById("userInputForm");
const departureDateInput = document.getElementById("departureDate");

// Add an event listener to the "Submit" button
document.getElementById("submitButton").addEventListener("click", function() {
    // Get the chosen date from the input field
    const chosenDate = departureDateInput.value;
    const newChosenDate = chosenDate.replace(/-/g, '');
    console.log(newChosenDate);
    // Construct the URL with the chosen date
    const url = `https://timetable-lookup.p.rapidapi.com/TimeTable/MNL/IAO/${newChosenDate}/?7Day=Y`;

    fetch(url, {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '652e1212b4msh02c7ed11051a093p1e77e2jsn34016fc1b090',
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
           // Parse the XML string to a DOM object
           const parser = new DOMParser();
           const xmlDoc = parser.parseFromString(result, 'text/xml');
       
           // Extract flight details
           const flightDetails = xmlDoc.querySelectorAll('FlightDetails');
           const flightInfo = [];
       
           flightDetails.forEach(flightDetail => {
             // convert some information to be readable by users
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
       
             // You can add more attributes as needed
       
             flightInfo.push(flight);
           });
       
           // Display flight information
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

    function extractDateAndTime(dateTimeString) {
      const dateTimeRegex = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})$/;
      const match = dateTimeString.match(dateTimeRegex);
  
      if (match) {
          // Extract the matched date and time
          const extractedDateTime = match[1];
          const [date, time] = extractedDateTime.split('T');
  
          return {
              date,
              time
          };
      }
  
      return null; 
  }
    
