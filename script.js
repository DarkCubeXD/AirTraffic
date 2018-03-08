// Alert user about collecting his location

function locationUsageAlert (){
    if(confirm("This site needs to use your location")){
        userLocation();
    }
}

// Get the users location

function userLocation() {
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition((e) => {
            
            // Show user location on a map
            
            const locationMap = document.querySelector(".locationMap");

            let locat = e.coords.latitude + "," + e.coords.longitude;
            let imgURL = "https://maps.googleapis.com/maps/api/staticmap?center=" + locat +
            "&zoom=14&size=400x300&key=AIzaSyBu-916DdpKAjTmJNIgngS6HL_kDIKU0aU";

            locationMap.src = imgURL;
        }, locationError());
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