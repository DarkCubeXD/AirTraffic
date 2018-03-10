// Alert user about collecting his location

window.onload = function (){
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

let altitude = [];
let codeNumber = [];
let manufacturer = [];
let model = [];
let destination = [];
let origin = [];
let filteredAT = [];

function filterAircraftTraffic(){

    // Fetch the json
    
    fetch("https://cors-anywhere.herokuapp.com/https://public-api.adsbexchange.com/VirtualRadar/AircraftList.json")
        .then(function(response) {
            return response.json();
        })

        // Filter the AirTraffic by location

        .then(function(e) {
            filteredAT = e["acList"].filter(function(e) {

                // Increase these numbers for wider radius

                if(e.Lat >= (lat - 1) &&
                    e.Lat <= (lat + 1) &&
                    e.Long >= (long - 1) &&
                    e.Long <= (long + 1) &&
                    e.Alt > 0)

                    return e;
                    
            });

            // Loop through the filtered AirTraffic

            for(let i = 0; i <= Object.keys(filteredAT).length - 1; i++){

                // Collect needed data

                altitude[i] = filteredAT[i]["Alt"];
                codeNumber[i] = filteredAT[i]["CNum"];
                manufacturer[i] = filteredAT[i]["Man"];
                model[i] = filteredAT[i]["Mdl"];
                destination[i] = filteredAT[i]["To"];
                origin[i] = filteredAT[i]["From"];

            }
            assignData();
        });
}

let p1, p2, p3;

function assignData(){
    altitude.sort(function(a, b) {return b - a});

    for(let i = 0; i <= Object.keys(altitude).length - 1; i++){
    
        // Assign data to newly created html tags

        let flightList = document.querySelector(".newListItems");

        let listItem = document.createElement("div");
        listItem.setAttribute("class", "listItem");
        listItem.setAttribute("name", `${codeNumber[i]}`);
        listItem.setAttribute("onclick", "showDetails(this)");

        // Filter the bounds

        if(filteredAT[i]["Trak"] >= 0 && filteredAT[i]["Trak"] <= 179){
            p1 = document.createElement("p");
            p1.innerHTML = "✈️";
        }
        else if(filteredAT[i]["Trak"] >= 180 && filteredAT[i]["Trak"] <= 359){
            p1 = document.createElement("p");
            p1.setAttribute("class", "flipped");
            p1.innerHTML = "✈️";
        }
        else if(filteredAT[i] == "undefined"){
            console.log("Undefined AT");
        }
        
        p2 = document.createElement("p");
        p2.innerHTML = codeNumber[i];

        p3 = document.createElement("p");
        p3.innerHTML = altitude[i];

        listItem.appendChild(p1);
        listItem.appendChild(p2);
        listItem.appendChild(p3);

        flightList.appendChild(listItem);

    }
}

// JS route workaround

let tempPage;
let closeButton;
let logo;
let info;

function showDetails(x){
    for(let i = 0; i <= Object.keys(altitude).length - 1; i++){
        if(x.getAttribute("name") == codeNumber[i]){
            
            tempPage = document.createElement("div");

            closeButton = document.createElement("p");
            closeButton.innerHTML = "Close<br />Information";
            closeButton.setAttribute("onclick", "closePage()");
            
            logo = document.createElement("img");
            logo.setAttribute("src", `https://logo-core.clearbit.com/${manufacturer[i]}.com?size=200`);
            logo.setAttribute("onerror", "defaultImage()");

            info = document.createElement("p");
            info.innerHTML = "<strong>Plane Maufacturer</strong>: " + manufacturer[i] + "<br /><br />" +
            "<strong>Plane Model</strong>: " + model[i] + "<br /><br />" +
            "<strong>Destination</strong>: " + destination[i] + "<br /><br />" +
            "<strong>Origin</strong>: " + origin[i]

            tempPage.setAttribute("class", "tempPage");
            tempPage.appendChild(closeButton);
            tempPage.appendChild(logo);
            tempPage.appendChild(info);
            
            document.body.appendChild(tempPage);
        }
    }
}

function closePage(){
    let tempPages = document.querySelectorAll(".tempPage");
    for(let i = 0; i <= tempPages.length - 1; i++)
    {
        tempPages[i].remove();
    }
}

function defaultImage(){
    logo.setAttribute("src", "https://cdn.pixabay.com/photo/2015/12/22/04/00/photo-1103595_960_720.png");
}

// Help button

document.querySelector(".help").addEventListener("click", () => {
    
    alert("Page refreshes every 60sec to ensure fresh data. \n" + 
    "Click on items for detailed information \n" +
    "If there are no items in the list that means that " +
    "there are currently no aircraft above you in a 110km radius.");

});

// Clear the old data

function clearOldData(){

    children = document.querySelector(".newListItems");

    while(children.firstChild){
        children.removeChild(children.firstChild);
    }
}
