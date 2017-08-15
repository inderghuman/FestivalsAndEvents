/**
 * Created by carlo on 2017-08-15.
 */
function makeYoutubeRequest(q) {
    var request = gapi.client.youtube.search.list({
        q: q,
        part: 'snippet',
        maxResults: 3
    });
    request.execute(function(response) {
        $('#youtubeResults').empty();
        var resultItems = response.result.items;
        $.each(resultItems, function(index, item) {
            vidID = item.id.videoId;
            vidURL = 'https://www.youtube.com/embed/' + vidID;
            vidTitle = item.snippet.title;
            vidThumburl =  item.snippet.thumbnails.default.url;
            vidThumbimg = '<div id="ytVideo"><iframe id="thumb" src="'+vidURL+'" style="width:304px;height:228px"></iframe></div>';
            $('#youtubeResults').append(vidThumbimg);
        });
    });
}
function initYoutubeAPI() {
    gapi.client.setApiKey('AIzaSyCWzGO9Vo1eYOW4R4ooPdoFLmNk6zkc0Jw');
    gapi.client.load('youtube', 'v3', function() {

    });
}
