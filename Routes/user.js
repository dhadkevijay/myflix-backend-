const Router = require('express').Router( );

const getEpisode = require('../Controllers/getEpisode');
const getListByCategory = require('../Controllers/getListByCategory');
const getMovie = require('../Controllers/getMovie');
const getPreview = require('../Controllers/getPreview');
const register = require('../Controllers/register');
const addUserRating = require('../Controllers/addUserRating');

Router.post( '/register', register );
Router.post( '/getMovie', getMovie );
Router.get( '/getPreview', getPreview );
Router.get( '/getEpisode', getEpisode );
Router.get( '/getListByCategory', getListByCategory );
Router.post( '/addUserRating', addUserRating );

module.exports = Router;