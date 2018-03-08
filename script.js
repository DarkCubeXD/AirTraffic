// Alert user about collecting his location

function locationUsageAlert (){
    if(confirm("This site needs to use your location")){
        userLocation();
        filterAircraftTraffic();
    }
    else {
        alert("You must click ok for this site to function, refresh the page and try again");
    }
}

// Get the users location

let lat = 0;
let long = 0;

function userLocation() {
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(e) {
            
            // Show user location on a map
            
            const locationMap = document.querySelector(".locationMap");
            
            lat = e.coords.latitude;
            long = e.coords.longitude;

            let locat = lat + "," + long;
            let imgURL = "https://maps.googleapis.com/maps/api/staticmap?center=" + locat +
                "&zoom=14&size=400x300&key=AIzaSyBu-916DdpKAjTmJNIgngS6HL_kDIKU0aU";

            locationMap.src = imgURL;
        }, locationError);
    }
    else {
        alert("This browser doesn't support geolocation!");
    }
}

// Error collection

function locationError(e) {
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

function filterAircraftTraffic(){

    fetch("https://cors-anywhere.herokuapp.com/https://public-api.adsbexchange.com/VirtualRadar/AircraftList.json")
    .then(function(response) {
        return response.json();
    })
    .then(function(e) {
        let filteredAT = e["acList"].filter(function(e) {

            if(e.Lat >= (lat - 0.5) &&
                e.Lat <= (lat + 0.5) &&
                e.Long >= (long - 0.5) &&
                e.Long <= (long + 0.5) &&
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

            console.log(Altitude[i] +
                ", " + CodeNumber[i] +
                ", " + Manufacturer[i] +
                ", " + Model[i] +
                ", " + Destination[i] +
                ", " + Origin[i]);
        }
    });
}