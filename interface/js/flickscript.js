$(document).ready(function() {

    var flickerAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";


    $('#flickr-search').submit(function (evt) {
        var $submitButton = $('#submit');
        //var $searchField = $('#search');
        evt.preventDefault();


        var tag = currentEvent.locations[0].locationName.split(',')[0];
        $('#photos').html('');
        $.getJSON(flickerAPI, {
                tags: tag,
                safe_search: 3,
                format: "json"
            },
            function(data){
                var result = '';
                var count = 0;
                if (data.items.length > 0) {

                    $.each(data.items,function(i,photo) {


                        result += count % 5 ? '<td style="border-style: solid;border-color: grey;">' : '<tr><td style="border-style: solid;border-color: grey;">';
                        result += '<a href="' + photo.link + '" target="a_blank" >';
                        result += '<img src="' + photo.media.m + '"></a>';
                        result += (count - 4) % 5 ? '</td>' : '</td></tr>';
                        count++;
                    }); // end each
                } else {
                    result = "<p>No photos found that match the location: " + tag + ".</p>";
                }


                $('#photos').html( result );

            }); // end getJSON

    }); // end click

}); // end ready