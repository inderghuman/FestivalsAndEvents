/**
 * Created by krist on 2017-08-01.
 */
window.Instagram = {
    /**
     * storing app settings
     */
    config: {},

    BASE_URL: 'https://api.instagram.com/v1',
    init: function( opt ) {
        opt = opt || {};
        this.config.access_token = opt.access_token;

    },

    /**
     * get a list of media
     */
    userMedia: function( acc, callback ) {
        var endpoint1 = this.BASE_URL + '/users/' +acc+ '/media/recent/?access_token=' + this.config.access_token;
        this.getJSON(endpoint1, callback);
    },
    userMediaSmall: function( acc, callback ) {
        var endpoint2 = this.BASE_URL + '/users/' +acc+ '/media/recent/?access_token=' + this.config.access_token + '&count=6';
        this.getJSON(endpoint2, callback);
    },
    getJSON: function( url, callback){
    $.ajax({
        type: 'GET',
        url: url,
        dataType: 'jsonp',
        success: function(response){
            if (typeof callback === 'function') callback(response);
        }
    });
    }
};

Instagram.init({
    access_token: '4274167510.9525df0.0885fd502879403a904007b54f2a138b'

});
//passing the missing part of the url for searh
$(document).ready(function () {
        var acc = '5820591755';
        Instagram.userMedia(acc, function(response){

            //append to the instagram id my result
            var $instagram = $('#instagram');
            $instagram.html('');
            //images - everything we receive
            images = response.data;
            for(var i = 0; i < images.length; i++){
                //getting thumbnails 150*150 images
                imageUrl = images[i].images.thumbnail.url;
                //getting their links
                imageLink = images[i].link;
                $instagram.append('<a href = "'+imageLink+'" target="_blank"><img src="' + imageUrl + '" style="border:.5px solid #4d004d" vspace="2" hspace="2"/></a>');
            }
        });
        Instagram.userMediaSmall(acc, function(response){

            //append to the instagram id my result
            var $instagramSmall = $('#instagram-small');
            $instagramSmall.html('');
            //images - everything we receive
            images = response.data;
            for(var i = 0; i < images.length; i++){
                //getting thumbnails 150*150 images
                imageUrl = images[i].images.thumbnail.url;
                //getting their links
                imageLink = images[i].link;
                $instagramSmall.append('<a href = "'+imageLink+'" target="_blank"><img src="' +
                    imageUrl + '" style="border:.5px solid #4d004d" vspace="2" hspace="10" height="175" width="175"/></a>');
            }
        })
});

