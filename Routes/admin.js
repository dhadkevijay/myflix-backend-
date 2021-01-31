const Router = require('express').Router( );

const upload = require('../Controllers/upload');

Router.post( '/upload', upload );

module.exports = Router;