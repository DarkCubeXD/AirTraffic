// Alert user about collecting his location

function locationUsageAlert(){
    if(confirm("This site needs to use your location")){
        userLocation();
    }
    else {
        alert("You must click ok for this site to function, refresh the page and try again");
    }
}

// Get the users location

let lat = 0;
let long = 0;

function userLocation(){
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(e) {
                        
            lat = e.coords.latitude;
            long = e.coords.longitude;

            filterAircraftTraffic();
            setInterval(clearOldData, 60000);
            setInterval(filterAircraftTraffic, 60000);
            

        }, locationError);
    }
    else {
        alert("This browser doesn't support geolocation!");
    }
}

// Error collection

function locationError(e){
    switch(e.code) {
        case e.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.")
            break;
        case e.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.")
            break;
        case e.TIMEOUT:
            alert("The request to get user location timed out.")
            break;
        case e.UNKNOWN_ERROR:
            alert("An unknown error occurred.")
            break;
    }
}

// Filter the Air Traffic

let Altitude = [];
let CodeNumber = [];
let Manufacturer = [];
let Model = [];
let Destination = [];
let Origin = [];
let filteredAT = [];

function filterAircraftTraffic(){
    fetch("https://cors-anywhere.herokuapp.com/https://public-api.adsbexchange.com/VirtualRadar/AircraftList.json")
        .then(function(response) {
            return response.json();
        })
        .then(function(e) {
            filteredAT = e["acList"].filter(function(e) {

            if(e.Lat >= (lat - 2) &&
                e.Lat <= (lat + 2) &&
                e.Long >= (long - 2) &&
                e.Long <= (long + 2) &&
                e.Alt > 0){

                console.log(e);
                return e;
            }
        });

        for(let i = 0; i <= Object.keys(filteredAT).length - 1; i++){
            Altitude[i] = filteredAT[i]["Alt"];
            CodeNumber[i] = filteredAT[i]["CNum"];
            Manufacturer[i] = filteredAT[i]["Man"];
            Model[i] = filteredAT[i]["Mdl"];
            Destination[i] = filteredAT[i]["To"];
            Origin[i] = filteredAT[i]["From"];
            
            let flightList = document.querySelector(".newListItems");

            let listItem = document.createElement("div");
            listItem.setAttribute("class", "listItem");

            let p1 = document.createElement("p");
            p1.innerHTML = "✈️";

            let p2 = document.createElement("p");
            p2.innerHTML = CodeNumber[i];

            let p3 = document.createElement("p");
            p3.innerHTML = Altitude[i];

            listItem.appendChild(p1);
            listItem.appendChild(p2);
            listItem.appendChild(p3);

            flightList.appendChild(listItem);
        }
    });
 
}

// Clear the old data

function clearOldData(){

    children = document.querySelector(".newListItems");

    while(children.firstChild){
        children.removeChild(children.firstChild);
    }
}
