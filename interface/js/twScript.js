function getTweets(orgName){
    var postData = {
        "search" : orgName,
    };
    $.ajax({
        url: '../Ajax/get_tweets.php',
        type: 'POST',
        data: postData,
        success: function(response) {
            if (typeof response.errors === 'undefined' || response.errors.length < 1) {
                var $tweets=$('<div></div>');
                if (response.statuses.length > 0){

                    $.each(response.statuses, function(i, obj) {
                        $tweets.append('<iframe border=0 ' +
                            'frameborder=0 height=300 style="display:inline-block;margin-left: 0px;"' +
                            'width=350 src="http://twitframe.com/show?url=https://twitter.com/web/status/'+obj.id_str+'">' + obj.text + '</iframe>');
                    });
                    $('#tweetsRelated').html($tweets);
                }else {
                    $('#tweetsRelated').text('There are no related Tweets');
                }

            } else {
                $('#tweetsRelated').text('There are no related Tweets');
            }
        },
        error: function(errors) {
            $('.tweets-container p:first').text('Request error');
        }
    });
};