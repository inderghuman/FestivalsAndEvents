var map;
function init(){

    var toronto = {lat: 43.70011, lng: -79.4163};
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,
        center: toronto
    });
}
function populateMap(json){

    //events response
    var events = json;
    var mylatlong;
    var mycontent;

    var markers = [];
    $.each(events, function(index,event){
        var eventDate = event.calEvent.startDate;
        var pattYear = new RegExp(new Date().getFullYear());
        //only shows current year events
        if (pattYear.test(eventDate)){
            var latitude = parseFloat(event.calEvent.locations[0].coords.lat);
            var longitude = parseFloat(event.calEvent.locations[0].coords.lng);
            mylatlong = {lat: latitude, lng: longitude};
            var eventName = "<h6>"+event.calEvent.eventName+"</h6>";

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
                content: eventName
            });
            marker.addListener('click',function(){

                infowindow.open(map,marker);

            });
            markers.push(marker);
        }


    });
    var markerCluster = new MarkerClusterer(map, markers,
        {
            imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
        });

}

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

