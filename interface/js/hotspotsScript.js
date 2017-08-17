var map;
        var points;
        var markers=[];
        var markerCluster;

        function initMap() { <!--looks like a constructor, new instance for map clase-->
            <!--In the script below is using the function however is in quotes aparently it does not know he is gonna use it-->
            var mylatlong={lat: 43.639832, lng: -79.355954};

            map = new google.maps.Map(document.getElementById('map'), {
                center: mylatlong, <!--is very similar to JSON without double quotes-->
                zoom: 10
            });

            initComponents();
        }




        function initComponents(){

            $('#gsc-i-id1').val("");
            $('.gsc-wrapper').hide();
            loadMarkers("Restaurants");
            showMarkers();
            document.getElementById("info").innerHTML="";
            document.getElementById("test").innerHTML="";


        };

        $("#select").change(function() {
            deleteMarkers();
            var selection = document.getElementById("select").value;
            loadMarkers(selection);
            showMarkers();
            $('#gsc-i-id1').val("");
            $('.gsc-wrapper').hide(1200);
        });

        function loadMarkers(selection){
            $.getJSON('../Ajax/restaurantsjson.json',function(data) {
                points = data.HOTSPOTS;
                $.each(points,function(index,point){
                    if(point.CATEGORY===selection) {
                        var mylatlong = {lat: point.LATITUDE, lng: point.LONGITUDE};
                        var marker = new google.maps.Marker({
                            position: mylatlong,
                            map: map,
                            title: point.PNT_OF_INT
                        });
                        var mycontent = "<b>Point of Interest: </b>" + point.PNT_OF_INT + "<br/>"
                            + "<b>Category: </b>" + point.CATEGORY

                        var information="<h1>The information is</h1>"+"<b>Point of Interest: </b>" + point.PNT_OF_INT +
                            "<br/>" + "<b>Category: </b>" + point.CATEGORY + "<br/>" +
                            "<b>Description: </b>" + point.DESCRPTION

                        var infowindow = new google.maps.InfoWindow({
                            content: mycontent
                        });
                        marker.addListener('mouseover', function () {
                            infowindow.open(map, marker);

                        });
                        marker.addListener('mouseout', function () {
                            infowindow.close(map, marker);
                        });
                        marker.addListener('click', function () {
                            document.getElementById("info").innerHTML=information;
                            $('#gsc-i-id1').val(point.PNT_OF_INT);
                            $('.gsc-search-button').click();
                            $('.gsc-wrapper').show();
                        });
                        markers.push(marker);
                    };
                });
                markerCluster=new
                MarkerClusterer(map,markers,
                    {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
            });
        };

        function clearMarkers() {
            setMapOnAll(null);

        };

        function showMarkers() {
            setMapOnAll(map);
        }

        function setMapOnAll(map) {

            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(map);
            }
        };

        function deleteMarkers() {
            clearMarkers();
            markers = [];
            markerCluster.clearMarkers();
            document.getElementById("info").innerHTML=null;

        }
		
