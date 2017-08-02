var map;
function init(){

    var toronto = {lat: 43.70011, lng: -79.4163};
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,
        center: toronto
    });
}
$(document).ready(function(){
    $.ajax({
        url: 'http://app.toronto.ca/cc_sr_v1_app/data/edc_eventcal_APR?limit=500',
        dataType: 'jsonp',
        success: function(json) {

            console.log("event JSON load");
            var events = json;

            var mylatlong;
            var mycontent;

            $.each(events, function(index,event){
                var latitude = parseFloat(event.calEvent.locations[0].coords.lat);
                var longitude = parseFloat(event.calEvent.locations[0].coords.lng);
                mylatlong = {lat: latitude, lng: longitude};
                var eventName = "<h6>"+event.calEvent.eventName+"</h6>";

                var marker = new google.maps.Marker({

                    position : mylatlong,
                    map: map,
                    title: event.calEvent.eventName
                });
                var infowindow = new google.maps.InfoWindow({
                    content: eventName
                });


                marker.addListener('click',function(){

                    infowindow.open(map,marker);

                });

            });
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
            $.getJSON( "../Ajax/events.json", function(data) {

                var events = data;

                var mylatlong;
                var mycontent;

                $.each(events, function(index,event){
                    var latitude = parseFloat(event.calEvent.locations[0].coords.lat);
                    var longitude = parseFloat(event.calEvent.locations[0].coords.lng);
                    mylatlong = {lat: latitude, lng: longitude};
                    var eventName = "<h6>"+event.calEvent.eventName+"</h6>";

                    var marker = new google.maps.Marker({

                        position : mylatlong,
                        map: map,
                        title: event.calEvent.eventName
                    });
                    var infowindow = new google.maps.InfoWindow({
                        content: eventName
                    });

                    marker.addListener('click',function(){

                        infowindow.open(map,marker);

                    });

                });

            });
        }
    });
});

