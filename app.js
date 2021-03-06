require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body['access_token']))
  .catch((error) => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (request, response) => {
  response.render('index');
});

app.get('/artist-search', (request, response) => {
  const artist = request.query.artistSearch;
  spotifyApi
    .searchArtists(artist)
    .then((data) => {
      response.render('artist-search-results', { artists: data.body.artists.items });
    })
    .catch((error) => console.log(error));
});

app.get('/albums/:artistid', (request, response) => {
  const artistId = request.params.artistid;
  spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      // console.log(data.body.items);
      response.render('albuns', { albuns: data.body.items });
    })
    .catch((error) => console.log(error));
});

app.get('/tracks/:albumid', (request, response) => {
  const albumId = request.params.albumid;
  spotifyApi
    .getAlbumTracks(albumId)
    .then((data) => {
      // console.log('tracks list');
      // console.log(data.body.items);
      response.render('tracks', { tracks: data.body.items });
    })
    .catch((error) => console.log(error));
});

// /albums/0Ty63ceoRnnJKVEYP0VQpk

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
