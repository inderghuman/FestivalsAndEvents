var map;
var jsonContent;
var directionsDisplay;
var directionsService;
var currentLat;
var currentLgt;
var selectedMarker;
var categories = new Array();
var categoriesList = [];
var featuresList = [];
var markers = [];
var markerCluster;
var currentEvent;
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
* event listener in charge of clearing the selected features and categories
* when the user clicks outside of the map and filter region region
* */
window.addEventListener('click', function(e){

    if (document.getElementById('eventsMapAPI').contains(e.target)){

    } else{
        clearSelected("eventCategories");
        clearSelected("eventFeatures");
    }
})

/*
* clearSelected: clear all the selected options of the multiselect elements inside
* the filter form
* */
function clearSelected(id){
    var elements = document.getElementById(id).options;

    for(var i = 0; i < elements.length; i++){
        elements[i].selected = false;
    }
}
/*
 * getSelector: get all the selected options inside a multiselect element from the
 * filter form
 * */
function getSelector(select){

    var select1 = document.getElementById(select);
    var selected1 = [];
    for (var i = 0; i < select1.length; i++) {
        if (select1.options[i].selected) selected1.push(select1.options[i].value);
    }
    return selected1;
}


/*
 * populateMapFilter: draws all the markers on the map using the markerClusterer option and the filters
 * */
function populateMapFilters(json){

    var selectedCategories = getSelector("eventCategories");
    var selectedFeatures = getSelector("eventFeatures");
    var selectedAccessibility = getSelector("accessibilitySelect");
    //events response
    var events = json;
    var mylatlong;
    var mycontent;

    //Array to store al the markers
    markers = [];
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
            //BEGIN: Check all the selected filters
            if ($('#freeEventCheck').is(':checked') ){

                if (event.calEvent.freeEvent == "No"){

                    return true;
                }

            }
            if ($('#reservationCheck').is(':checked') ){

                if (event.calEvent.reservationsRequired == "No"){

                    return true;
                }

            }

            if (selectedCategories.length > 0){
                var isCategory=false;
                for(var i = 0; i< selectedCategories.length;i++){

                    if (event.calEvent.categoryString.indexOf(selectedCategories[i]) >= 0){

                        isCategory=true;
                        break;
                    }
                }
                if (!isCategory){
                    return true;
                }
            }


            if (selectedFeatures.length > 0){
                var isFeature=false;

                if (event.calEvent.features && Object.keys(event.calEvent.features).length > 0){

                    for (var i=0; i < Object.keys(event.calEvent.features).length; i++) {

                        if (selectedFeatures.indexOf(Object.keys(event.calEvent.features)[i]) >= 0 ){

                            isFeature=true;
                            break;
                        }

                    }

                }
                if (!isFeature){
                    return true;
                }

            }

            if (selectedAccessibility.length > 0){

                if (selectedAccessibility[0]!=event.calEvent.accessibility){
                    return true;
                }
            }
            //END: Check all the selected filters
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
                $('#orgNameid').html(event.calEvent.orgName);
                searchBYorgName(event.calEvent.orgName);
                makeYoutubeRequest(event.calEvent.eventName);
                currentEvent = event.calEvent;
                $('#flickr-search').submit();
                selectedMarker = marker;

            });
            markers.push(marker);

        }


    });

    //Creates the cluster using the images
    markerCluster = new MarkerClusterer(map, markers,
        {
            imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
        });


    //remove all previous traced routes
    directionsDisplay.setMap(null);
}



/*
* populateMap: draws all the markers on the map using the markerClusterer option
* */
function populateMap(json, applyFilters){

    //events response
    var events = json;
    var mylatlong;
    var mycontent;

    //Array to store al the markers
    markers = [];
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
                $('#orgNameid').html(event.calEvent.orgName);
                searchBYorgName(event.calEvent.orgName);
                makeYoutubeRequest(event.calEvent.eventName);
                currentEvent = event.calEvent;
                $('#flickr-search').submit();
                selectedMarker = marker;

            });
            markers.push(marker);

            //add categories into an array
            fillCategoryList(event.calEvent.categoryString);

            //add features into and array
            fillFeaturesList(event.calEvent.features);

        }


    });

    fillCategoriesFilter();
    fillFeaturesFilter();

    //Creates the cluster using the images
    markerCluster = new MarkerClusterer(map, markers,
        {
            imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
        });

}
/*
*
* applyEventFilters: Function in charge of deleting the previous markers and
* populating the markers with the markers that match the filters
* */
function applyEventFilters(){

    deleteMarkers();
    populateMapFilters(jsonContent);

}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
    clearMarkers();
    markers = [];
    markerCluster.clearMarkers();

}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
    setMapOnAll(null);
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

/*
 * fillFeaturesList: fills the JS list with the features object keys inside
 * the JSON.
 * */
function fillFeaturesList(features){

    if (features && Object.keys(features).length > 0){

        for (var i=0; i < Object.keys(features).length; i++) {

            if (featuresList.indexOf(Object.keys(features)[i]) < 0 ){

                featuresList.push(Object.keys(features)[i]);
            }

        }

    }

}


/*
* fillCategoryList: fills the JS list with the categoryString split value provided
* by the JSON. CategoryString example, category1,category2,category3
*
* */
function fillCategoryList(categoryString){

    if (categoryString){

        categories =categoryString.split(',');

        for (var i=0; i < categories.length; i++) {

            if (categoriesList.indexOf(categories[i]) < 0 ){

                categoriesList.push(categories[i]);
            }

        }

    }

}
/*
 fills the dropdown list asociated with the events categories
 * */
function fillCategoriesFilter(){

    $('#eventCategories').empty();
    $.each(categoriesList.sort(), function(i, p) {
        $('#eventCategories').append($('<option></option>').val(p).html(p));
    });
}

/*
 fills the dropdown list asociated with the events features
 * */
function fillFeaturesFilter(){

    $('#eventFeatures').empty();
    $.each(featuresList.sort(), function(i, p) {
        $('#eventFeatures').append($('<option></option>').val(p).html(p));
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
    var eventFeature = document.getElementById('eventFeaturesInfo');
    var eventAccs = document.getElementById('eventAccessibility');
    var eventLocation = document.getElementById('eventLocation');


    description.innerHTML = event.calEvent.description;
    eventName.innerHTML = "Event: <i>" + event.calEvent.eventName + "</i>";
    eventAddress.innerHTML = "<b>Address:</b> " + event.calEvent.locations[0].address;
    eventStartDate.innerHTML = "<b>Start date:</b> " + event.calEvent.startDate.split('T')[0];
    eventEndDate.innerHTML = "<b>End date:</b> " + event.calEvent.endDate.split('T')[0];
    eventCat.innerHTML = "<b>Event Category: </b>" + (event.calEvent.categoryString ? event.calEvent.categoryString : "Unavailable");
    eventLocation.innerHTML = "<b>Event Location: </b>" + (event.calEvent.locations[0].locationName ? event.calEvent.locations[0].locationName : "Unavailable");
    eventFeature.innerHTML = "<b>Event Features: </b>" + (event.calEvent.features && Object.keys(event.calEvent.features).length > 0 ? Object.keys(event.calEvent.features).join(", ") : "Unavailable");
    eventAccs.innerHTML = "<b>Accessibility:</b> " + (event.calEvent.accessibility ? event.calEvent.accessibility : "Unavailable");
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
            jsonContent = json;
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

                jsonContent = json;
                populateMap(json);

            });
        }
    });
});

