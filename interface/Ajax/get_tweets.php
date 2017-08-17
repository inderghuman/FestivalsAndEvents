<?php

require_once('twitter_proxy.php');

// Twitter OAuth Config options
$oauth_access_token = '172786495-cMIyrTZ9MPDzJMj2pEM1xAtxVgzeA72MjjXEi6u4';
$oauth_access_token_secret = 'KwOerauLnj4vNyNFjgIGYXInR6xuaglCO2fdZ6FDozj1J';
$consumer_key = 'bYgoL5IxeRB2Yme80INZemvj2';
$consumer_secret = 'Q4oJXc0vTU684TO2vxFPG7Y4fGGtKOvru5WHVxcPivUmR6DzXe';
$user_id = '78884300';
$screen_name = $_POST['search'];
$count = 3;

$twitter_url = 'search/tweets.json';
$twitter_url .= '?q=' . $screen_name;
$twitter_url .= '&count=' . $count;

// Create a Twitter Proxy object from our twitter_proxy.php class
$twitter_proxy = new TwitterProxy(
    $oauth_access_token,         // 'Access token' on https://apps.twitter.com
    $oauth_access_token_secret,  // 'Access token secret' on https://apps.twitter.com
    $consumer_key,               // 'API key' on https://apps.twitter.com
    $consumer_secret,            // 'API secret' on https://apps.twitter.com
    $screen_name,                // Twitter handle
    $count                       // The number of tweets to pull out
);

// Invoke the get method to retrieve results via a cURL request
$tweets = $twitter_proxy->get($twitter_url);

echo $tweets;

?>