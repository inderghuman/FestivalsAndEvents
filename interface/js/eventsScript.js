var map;
var directionsDisplay;
var directionsService;
var currentLat;
var currentLgt;
var selectedMarker;
//var eventDetails = document.getElementById("eventDetails");
//var eventSocialMedia = document.getElementById("eventSocialMedia");
//eventDetails.style.display = "none";
//eventSocialMedia.style.display = "none";

/*
* Init: initializes the google map api
* */
function init(){

    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    var toronto = {lat: 43.70011, lng: -79.4163};
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,
        center: toronto
    });
    navigator.geolocation.getCurrentPosition(function(location) {
        console.log(location.coords.latitude);
        console.log(location.coords.longitude);
        currentLat = location.coords.latitude;
        currentLgt = location.coords.longitude;
        //console.log(location.coords.accuracy);
    });
}

/*
* traceRoute: Display the best route to take to get to the selected marker
* using the method (DRIVING, WALKING, BICYCLING) selected.
* The starting point is obtained using geolocation
* */
function traceRoute(marker, method) {

    if(method!="select"){

        document.getElementById("eventsMapAPI").scrollIntoView();
        var pos = marker.position;
        var start = new google.maps.LatLng(currentLat, currentLgt);
        var end = new google.maps.LatLng(pos.lat(), pos.lng());
        var bounds = new google.maps.LatLngBounds();
        bounds.extend(start);
        bounds.extend(end);
        map.fitBounds(bounds);

        var request = {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode[method]
        };
        directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
                directionsDisplay.setMap(map);
            } else {
                alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
            }
        });

    }

}

/*
* populateMap: draws all the markers on the map using the markerClusterer option
* */
function populateMap(json){

    //events response
    var events = json;
    var mylatlong;
    var mycontent;

    //Array to store al the markers
    var markers = [];
    //used for closing previous infoWindow
    var prev_infowindow =false;

    $.each(events, function(index,event){
        var eventDate = event.calEvent.startDate;
        var pattYear = new RegExp(new Date().getFullYear());
        //only shows current year events
        if (pattYear.test(eventDate)){
            var latitude = parseFloat(event.calEvent.locations[0].coords.lat);
            var longitude = parseFloat(event.calEvent.locations[0].coords.lng);
            mylatlong = {lat: latitude, lng: longitude};
            var eventShortDesc = "<p><b> Name: </b>"+event.calEvent.eventName+"</p>" +
                "<p><b>Address: </b>"+event.calEvent.locations[0].address+"</b>";
            //If the event has short description, then it is added to the popup
            if (event.calEvent.shortDescription){

                eventShortDesc+="<p><b>Short description: </b>"+event.calEvent.shortDescription+"</b>";
            }

            //check for events with the exact same location
            if (markers.length != 0) {

                for (var i=0; i < markers.length; i++) {
                    var existingMarker = markers[i];
                    var pos = existingMarker.position;

                    //if a marker already exists in the same position as this marker
                    if (mylatlong.lat==pos.lat() &&
                        mylatlong.lng==pos.lng()) {
                        //update the position of the coincident marker by applying a small multipler to its coordinates
                        mylatlong.lat = mylatlong.lat + (Math.random() -.5) / 1500;
                        mylatlong.lng = mylatlong.lng + (Math.random() -.5) / 1500;
                    }
                }
            }
            var marker = new google.maps.Marker({

                position : mylatlong,
                //map: map,
                title: event.calEvent.eventName
            });
            var infowindow = new google.maps.InfoWindow({
                content: eventShortDesc
            });
            marker.addListener('click',function(){

                //Check if there is another infoWindow open,
                //if there is then close it
                if( prev_infowindow ) {
                    prev_infowindow.close();
                }

                prev_infowindow = infowindow;

                infowindow.open(map,marker);

                moreInfo(event, marker);
                selectedMarker = marker;

            });
            markers.push(marker);

        }


    });
    //Creates the cluster using the images
    var markerCluster = new MarkerClusterer(map, markers,
        {
            imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
        });

}

/*
moreInfo: Displays more information about the event
* */
function moreInfo(event) {

    var description = document.getElementById('description');
    var eventName = document.getElementById('eventName');
    var eventImage = document.getElementById('eventImage');
    var eventAddress = document.getElementById('eventAddress');
    var eventPeak = document.getElementById('eventPeak');
    var eventFree = document.getElementById('eventFree');
    var eventRes = document.getElementById('eventRes');
    var eventPhone = document.getElementById('eventPhone');
    var eventCat = document.getElementById('eventCat');
    var eventEmail = document.getElementById('eventEmail');
    var eventWebsite = document.getElementById('eventWebsite');
    var eventStartDate = document.getElementById('eventStartDate');
    var eventEndDate = document.getElementById('eventEndDate');


    description.innerHTML = event.calEvent.description;
    eventName.innerHTML = "Event: <i>" + event.calEvent.eventName + "</i>";
    eventAddress.innerHTML = "<b>Address:</b> " + event.calEvent.locations[0].address;
    eventStartDate.innerHTML = "<b>Start date:</b> " + event.calEvent.startDate.split('T')[0];
    eventEndDate.innerHTML = "<b>End date:</b> " + event.calEvent.endDate.split('T')[0];
    eventCat.innerHTML = "<b>Event Category: </b>" + (event.calEvent.categoryString ? event.calEvent.categoryString : "Unavailable");
    eventPeak.innerHTML = "<b>Peak Attendance: </b>" + (event.calEvent.expectedPeak ? event.calEvent.expectedPeak : "Unavailable");
    eventFree.innerHTML = "<b>Free: </b>" + (event.calEvent.freeEvent ? event.calEvent.freeEvent : "Unavailable");
    eventRes.innerHTML = "<b>Reservation Required: </b>" + (event.calEvent.reservationsRequired ? event.calEvent.reservationsRequired : "Unavailable");
    eventPhone.innerHTML = "<b>Phone Number: </b>" + (event.calEvent.eventPhone ? event.calEvent.eventPhone : "Unavailable");
    eventEmail.innerHTML = "<b>Email: </b>" + (event.calEvent.eventEmail ? event.calEvent.eventEmail : "Unavailable");
    eventWebsite.innerHTML = "<b>Website: </b>" + (event.calEvent.eventWebsite ? '<a href="'+event.calEvent.eventWebsite+'" target="_blank">'+event.calEvent.eventWebsite+'</a>' : "Unavailable");
    eventImage.src = (event.calEvent.thumbImage ? "http://app.toronto.ca" + event.calEvent.thumbImage.url: "Unavailable") ;

    document.getElementById("eventDetails").style.display = "inline";
    //document.getElementById("eventDetails").scrollIntoView(); //Automatically scroll page to eventDetails

    var element = document.getElementById('transportSelect');
    element.value = "select";
}

function selectTransportation(){

    var trasnportSelect = document.getElementById("transportSelect");
    var method = trasnportSelect.options[trasnportSelect.selectedIndex].value;

    traceRoute(selectedMarker, method);

}
/*
* Gets the JSON from the given URL, if it fails, then it is going
* to use the local file events.json
* */
$(document).ready(function(){
    $.ajax({
        url: 'http://app.toronto.ca/cc_sr_v1_app/data/edc_eventcal_APR?limit=500',
        dataType: 'jsonp',
        success: function(json) {

            console.log("event JSON load");
            populateMap(json);

        },

        error: function (jqXHR, exception) {
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            console.log(msg);
            $.getJSON( "../Ajax/events.json", function(json) {

                populateMap(json);

            });
        }
    });
});

