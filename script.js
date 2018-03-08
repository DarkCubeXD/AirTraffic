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
            console.log(e);
        });
    }
    else {
        alert("This browser doesn't support geolocation!");
    }
}