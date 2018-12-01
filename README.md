# liri-node-app


Language Interpretation and Recognition Interface
Author: Anna Stein

Feel free to use any of this code if you're working on a similar project.

Project Overview
LIRI is like iPhone's SIRI. However, while SIRI is a Speech Interpretation and Recognition Interface, LIRI is a Language Interpretation and Recognition Interface.

liri.js
A command line Node app that takes in parameters and returns data from the following APIs: Bandsintown, Spotify and OMDb.

How it works (v1)
Type into the command line....

node liri.js 
select an option from the list
        -- What would you like to do? (Use arrow keys)
            ❯ Pull Concert Information 
            Spotify a Song 
            Pull Movie Information 
            Do What It Says 

for option 1 (Concert) answer the following question:
        What artist? 
            (Ex. PINK)

for option 2 (Spotify) answer the following question:
        What song? 
            (Ex. Happy)

for option 3 (Movie) answer the following question:
        What movie? 
            (Ex. Harry Potter)


Technology and Packages used
Node.js

chalk

figlet

fs

axios

moment

Bandsintown API

OMDb API

Spotify API

Executing the Project
Register for API keys from Bandsintown API, OMDb API, Spotify API.
Once you have the keys clone this project.
Create a .env file and have the following entries
SPOTIFY_ID="<--YOUR_KEY_HERE-->"
SPOTIFY_SECRET="<--YOUR_KEY_HERE-->"
Then run the following command to install the requied node packages
node install

Look at the mp4 below on the execution details

/liri-node-app-anna.mp4
