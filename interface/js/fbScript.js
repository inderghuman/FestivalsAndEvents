
var link;
var idOrg;
window.fbAsyncInit = function() {
    FB.init({
        appId      : '564032763721006',
        cookie      : true,
        xfbml      : true,
        version    : 'v2.10'

    });


};

(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.10&appId=564032763721006";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function searchBYorgName(name){
    FB.api('search?q='+name+'&type=place&access_token=EAAIAZCByF9S4BAH8AN8xTPJz8rNyr' +
        'LK59WYFLgXVNd2UpNV2UwnidoBgpqEVnIbxBarE5itJy7VhS0FhZASo30qqsBXNCXgcJQ6sWL445' +
        'nTUUVeWKahUP9mvxVGNkTX5qRNSqKyy6Odf3SlMIZAkH1buOswZAvEdYsL0sKzB9AZDZD', function(response){
        console.log(response && response.error);
//gives id

        idOrg = response.data[0].id;
        searchpost(idOrg);

    });

}
function searchpost(idOrg){
    FB.api(idOrg+'/feed?limit=3&access_token=EAAIAZCByF9S4B' +
        'AH8AN8xTPJz8rNyrLK59WYFLgXVNd2UpNV2UwnidoBgpqEVnIbxBa' +
        'rE5itJy7VhS0FhZASo30qqsBXNCXgcJQ6sWL445nTUUVeWKahUP9mvx' +
        'VGNkTX5qRNSqKyy6Odf3SlMIZAkH1buOswZAvEdYsL0sKzB9AZDZD', function(response){
        console.log(response && response.error);
//gives posts
        $("#fb-root1").html('');

        for(var i = 0; i < response.data.length; i++){


            var idPost = response.data[i].id;
            getLink(idPost);



        }


    });
}

function getLink(idPost){
    FB.api(idPost+'?fields=link&access_token=EAAIAZCByF9S4BAH' +
        '8AN8xTPJz8rNyrLK59WYFLgXVNd2UpNV2UwnidoBgpqEVnIbx' +
        'BarE5itJy7VhS0FhZASo30qqsBXNCXgcJQ6sWL445nTUUVeWKahUP' +
        '9mvxVGNkTX5qRNSqKyy6Odf3SlMIZAkH1buOswZAvEdYsL0sKzB9AZDZD', function(response){
        console.log(response && response.error);
//gives posts

        var $fbPosts = $('<iframe class="fb-post"></iframe>');


        $fbPosts.html('');
        $fbPosts.attr('width', 500);
        $fbPosts.attr('height', 600);
        $fbPosts.attr('scrolling', "yes");

        $fbPosts.attr('style', "transform:scale(0.7,0.7);margin-top: -80px;margin-left: -70px;display:block;border:none;overflow:hidden;");
        $fbPosts.attr('frameborder', "0");
        $fbPosts.attr('allowTransparency', "true");
        $fbPosts.attr('src', "https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2F" + idOrg + "%2Fposts%2F" + response.id.split('_')[1] + "%2F&width=500&show_text=true&appId=564032763721006");

        $("#fb-root1").append($fbPosts);


    });
}
function clear(){
    var iframe = document.getElementById("fb-post");
    var iframediv = iframe.contentWindow.document;
    var html= iframediv.body.innerHTML;
    if(document.getElementById("fb-post") != null){

        html="";
    }
}