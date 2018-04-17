require("dotenv").config();
var fs = require("fs");
var request = require("request")
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var twitter = require('twitter');
var spotify = new Spotify(keys.spotify);
var client = new twitter(keys.twitter);

var userInput = process.argv[2];
var secondInput = process.argv[3];

switch (userInput){
    case 'my-tweets':   
        myTweets();
        break;
    
    case 'spotify-this-song':
        if(secondInput == undefined){
            var song = "The Sign";
            spotifyThisSong(song);
        }
        else
        {
            var song = secondInput;
            spotifyThisSong(song);
        }
        break;
    case 'movie-this':
        if(secondInput == undefined){
            var movie = "Mr Nobody";
            showMovieInfo(movie);
        }
        else
        {
            var movie = secondInput;
            showMovieInfo(movie);
        }
        break;
    case 'do-what-it-says':
        doWhatItSays();
        break;
    default:
        console.log("type something else, it didn't do what you thought it would");
        break;
}


function myTweets() {
    var params = {
        screen_name: "kookykarma",
        count: "2"
    };

    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            var myTweet = JSON.parse(response.body);
            myTweet.forEach(function(tweet) {
                console.log(tweet.created_at);
                console.log(tweet.text);
            });
        }
        else
        {
            console.log(error);
        }
    });
}

function spotifyThisSong(songName){
    spotify.search({ 
        type: 'track', 
        query: songName,
        limit: 1 
    }, function(err, data) {
        if ( err ) {
            console.log('Error occurred: ' + err);
            return;
        }
        else
        {
            data.tracks.items.forEach(function(event){
                console.log("***Artist: " + event.album.artists[0].name + "***");
                console.log(event.name);
                console.log("Go to this site to hear a preview: " + event.preview_url);
                console.log("Album: "+ event.album.name);

            });
        }
     
    });
}

function showMovieInfo(movieName){
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    request(queryUrl, function(err, response, body){
        if ( err ) {
            console.log('Error occurred: ' + err);
            return;
        }
        else
        {
            var m = JSON.parse(response.body);
            console.log("***Title: "+ m.Title + "***");
            console.log("Release date: " + m.Year);
            console.log("IMDB rating: "+ m.Ratings[0].Value);
            console.log("Rotten Tomatoes rating: " + m.Ratings[1].Value);
            console.log("Production location(s): " + m.Country);
            console.log("Language(s): " + m.Language);
            console.log("Plot: " + m.Plot);
            console.log("Main Actors: "+ m.Actors);
        }
    })
}

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(err, data){
        if (err) {
            return console.log(err);
        }
        var textArray = data.split(",");
        var command = textArray[0];
        var input = textArray[1];
        switch(command){
            case 'my-tweets':
                myTweets();
                break;
            case 'spotify-this-song':
                spotifyThisSong(input);
                break;
            case 'movie-this':
                showMovieInfo(input);
                break;
            default:
                console.log("try again.");
                break;
        }

    });
}
