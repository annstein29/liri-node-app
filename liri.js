require("dotenv").config();
var Spotify = require("node-spotify-api");
var axios = require("axios");
var keys = require("./key.js");
var inquirer = require("inquirer");
var fs = require("fs");
var figlet = require("figlet")
var chalk = require("chalk")
var moment = require("moment")

var spotify = new Spotify(keys.spotify);

const divider = "-".repeat(80)

const dataTheme = chalk.bold.cyanBright


// Create command line UI with list of actions for Liri
inquirer.prompt([
    {
        type: "list",
        name: "command",
        message: "What would you like to do?",
        choices: ["Pull Concert Information", "Spotify a Song", "Pull Movie Information", "Do What It Says"]
    }
]).then(function (response) {
    // Switch Case for all available actions in Liri
    switch (response.command) {
        case "Pull Concert Information":
        inquirer.prompt([
            {
                type: "input",
                name: "artist",
                message: "What artist?"
            }
        ]).then(function (event) {
            var userArtist = event.artist;
            concertInfo(userArtist);
        });
            break;
        case "Spotify a Song":
        // Secondary prompt for what song to search in Spotify
            inquirer.prompt([
                {
                    type: "input",
                    name: "song",
                    message: "What song?"
                }
            ]).then(function (song) {
                var userSong = song.song;
                spotifySong(userSong);
            });
            break;
        case "Pull Movie Information":
        // Secondary prompt for what movie to search in OMDB
            inquirer.prompt([
                {
                    type: "input",
                    name: "movie",
                    message: "What movie?"
                }
            ]).then(function (movie) {
                var userMovie = movie.movie;
                movieThis(userMovie);
            });
            break;
        case "Do What It Says":
            doWhatItSays();
            break;
    };
});


// Function to pull Concert Info from Bands in Town
function concertInfo(parameter){

    // if ('concert')
    // {
        // var artist="";
       
    let bandsFig = "concertInfo"
        figlet(bandsFig, function(err, data) {
            if (err) {
                console.log('Something went wrong...');
                console.dir(err);
                return;
            }
            console.log(chalk.green(data));
        });
        // console.log(artist);
    // }
    // else
    // {
    //     artist = parameter;
    // }
    
    
    
    var queryUrl = "https://rest.bandsintown.com/artists/"+ parameter +"/events?app_id=codingbootcamp";
    

    axios.get(queryUrl).then(response => {
        let output = ""
        if(response.data.length === 0){

            output = "No Concerts available"
            }
        response.data.forEach(event => {
            output += `\n${divider}\nVenue: ${event.venue.name} \nLocation: ${event.venue.city}, ${event.venue.region ? event.venue.region : event.venue.country} \nDate: ${moment(event.datetime).format("MM/DD/YYYY")}`
          });
        console.log(output);
        fs.appendFile("log.txt", "['Command: concertInfo', '" + output + "']\n", function (err) {
            if (err) throw err;
        })
      }).catch(err => {
        console.log(err);
            fs.appendFile("log.txt", err, function (err) {
                if (err) throw err;
            })
        return
      })
    
    }
    


// Function to pull Spotify information for song searched with Spotify package and Spotify API
function spotifySong(song) {
    // Default response if no user input
    if (song === "") {
        spotify
            .request('https://api.spotify.com/v1/tracks/3DYVWvPh3kGwPasp7yjahc')
            .then(function (data) {
                var logSpotifyText = ("\nArtist: " + data.artists[0].name +
                    "\nSong title: " + data.name +
                    "\nAlbum name: " + data.album.name +
                    "\nURL Preview: " + data.preview_url + "\n"
                );
                console.log(logSpotifyText);
                fs.appendFile("log.txt", "['Command: spotify-this-song', '" + logSpotifyText + "']\n", function (err) {
                    if (err) throw err;
                })
            })
            .catch(function (err) {
                console.error('Error occurred: ' + err);
            });
    } else {
        // Response with user input
        spotify
            .search({ type: 'track', query: song })
            .then(function (response) {
                var info = response.tracks.items;
                var logSpotifyText = ("\nArtist: " + info[0].artists[0].name +
                    "\nSong title: " + info[0].name +
                    "\nAlbum name: " + info[0].album.name +
                    "\nURL Preview: " + info[0].preview_url + "\n"
                );
                console.log(logSpotifyText);
                fs.appendFile("log.txt", "['Command: spotify-this-song', '" + logSpotifyText + "']\n", function (err) {
                    if (err) throw err;
                })
            })
            .catch(function (err) {
                console.log(err);
            });
    }
};

// Function to pull movie information from movie searched with OMDB API 
function movieThis(movie) {
    var movieName = "";
    // Default response if no user input then with user input
    if (movie === "") {
        movieName = "Mr+Nobody";
    } else {
        movieName = String(movie);
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    axios.get(queryUrl).then(response => {
        let movieData = response.data
        let logMovieText = `\n${divider}\nTitle: ${dataTheme(movieData.Title)} \nReleased Year: ${movieData.Year} \nIMDB Rating: ${movieData.Ratings[0].Value} \nRotten Tomatoes Score: ${movieData.Ratings[1].Value} \nCountry Where Movie was Produced: ${movieData.Country}  \nLanguage: ${movieData.Language} \nPlot: ${movieData.Plot}  \nCast: ${movieData.Actors} \n${divider}`
        console.log(logMovieText);
        fs.appendFile("log.txt", "['Command: movie-this', '" + logMovieText + "']\n", function (err) {
            if (err) throw err;
        })
      }).catch(err => {
        console.log(err);
            fs.appendFile("log.txt", err, function (err) {
                if (err) throw err;
            })
        return
      })
};

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        console.log(data);
        fs.appendFile("log.txt", "['Command: do-what-it-says', '" + data + "']\n", function (err) {
            if (err) throw err;
        })
        spotifySong(data);
    });
};