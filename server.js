const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressFileUpload = require('express-fileupload');
const adminRouter = require('./Routes/admin');
const userRouter = require('./Routes/user');

const app = express( );

const url = 'mongodb+srv://programmer:dlowbeatboxblad@cluster0.bj5cw.mongodb.net/myFlix?retryWrites=true&w=majority';

app.use( bodyParser.json( ) );
app.use( expressFileUpload( ) );
app.use( cors( ) );

app.get( '/', function ( request, response ) {

    response.send('Server is working');
})

app.use( '/',userRouter );
app.use( '/admin',adminRouter );

mongoose.connect( url, {

    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true

}, function ( ) {

    console.log('Connected to database');

    app.listen( 8080,  ( ) => console.log('Server started at port 4000') );
});