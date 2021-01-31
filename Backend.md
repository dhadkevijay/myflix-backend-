<style>

    * {

        font-family: 'Fira Code';
        font-size: 1.3rem;
        font-style: italic;
    }

    p {

        font-style: normal;
        font-family: 'Glora';
        margin: 2rem 0;
        letter-spacing: 2px;
    }

    h1 {

        font-size: 3rem;
    }

    h2 {

        font-size: 2rem;
        color: orange;
        margin: 9rem 0 5rem 0;
    }

    span {

        color: green;
    }

    .center {

        width: 100%;
        text-align: center;
        margin-top: 5rem;
    }
</style>

# MyFlix

## Creating the server and connecting to database

In the root project folder, open the terminal and enter the following commands :

```zsh

    mkdir backend
    cd backend
    npm init -y
    npm install --save express nodemon body-parser mongoose express-fileupload
```

In the package.json file created, write the following script :

```json

    {
        "scripts" : {

            "start" : "nodemon server.js"
        }
    }
```

To start the server, from now on, iin the terminal, write the following script :

```zsh

    npm run start
```

## Create server and connect to database

Now create a server.js file, where we wil create a server and connect to the database. First connect to the database

<span>server.js</span>

```js

    const url = '';

    require('mongoose').connect( url ).then(

        function ( )
        {
            console.log('Connected to database');
        }
    )
```

Then start up the server at the required port :

<span>server.js</span>

```js

    const express = require('express');
    const app = require('express');

    const url = '';

    require('mongoose').connect( url ).then(

        function ( )
        {
            console.log('Connected to database');

            app.listen( 4000, ( ) => console.log('Started server') );
        }
    )
```

Now we are going to apply some middlewares to our server.

* To parse request bodies encoded in json, we will use the 'body-parser' library :

<span>server.js</span>

```js

    app.use( require('body-parser').json( ) );
```

* To parse the video/ photo files received from frontend, we will use the 'express-fileupload' library :

<span>server.js</span>

```js

    app.use( require('express-fileupload')( ) );
```

* By default our server doesn't accept requests from other resources. To enable that, we will be using the 'cors' library :

<span>server.js</span>

```js

    app.use( require('cors')( ) );
```

## Creating routes

Now let us create routes. There will be 2 types of routes: user and admin !

<span>server.js</span>

```js

    app.use( '/', UserRoute );
    app.use( '/admin', AdminRoute );
```

Create the User route :

<span>/Routes/User.js</span>

```js

    const Router = require('express').Router( );
    
    const getEpisode = require('../Controllers/getEpisode');
    const getListByCategory = require('../Controllers/getListByCategory');
    const getMovie = require('../Controllers/getMovie');
    const getPreview = require('../Controllers/getPreview');
    const register = require('../Controllers/register');
    
    Router.post( '/register', register );
    Router.post( '/getMovie', getMovie );
    Router.get( '/getPreview', getPreview );
    Router.get( '/getEpisode', getEpisode );
    Router.get( '/getListByCategory', getListByCategory );
    
    module.exports = Router;
```

Create the Admin route :

<span>/Routes/Admin.js</span>

```js

    const Router = require('express').Router( );

    const upload = require('../Controllers/upload');
    
    Router.post( '/upload', upload );
    
    module.exports = Router;
```

## Creating Database model

First create the document object model, for movies. Each movie will look like this :

<span>/Database/schema.js</span>

```js

    const userSchema = new require('mongoose').Schema(
    
        // document object model
        {
    
            email: {
    
                type: String,
                unique: true,
                required: true
            },
    
            password: {
    
                type: String,
                required: true
            }
        },
    
        // collection name where the objects will be stored
        {
    
            collection: 'users'
        }
    );
```

Similarly we will create the document object model for users :

<span>/Database/schema.js</span>

```js

    const moviesSchema = new Schema(
    
        {
    
            title: {
    
                required: true,
                type: String,
                unique: true
            },
    
            path: {
    
                type: String,
                required: true
            },
    
            type: {
    
                type: String,
                required: true
            },
    
            category: {
    
                type: String,
                required: true
            }
        },
    
        {
    
            collection: 'movies'
        }
    )
```

Now we will export these 2 document object models, so that we can use them for reading or writing, in other files :

<span>/Database/schema.js</span>

```js

    module.exports = {
    
        users: mongoose.model( 'users', userSchema ),
        movies: mongoose.model( 'movies', moviesSchema )
    };
```

## Uploading a movie

Create a Content folder, in the backend folder, where our movie files will be stored.

First extract the movie details from the request body.

<span>/Controllers/upload.js</span>

```js

    module.exports = function ( request, response )
    {
        const [ title, type, category ] = Object.values( request.body );
    }
```

Construct a path for the movie, where the files will be stored. For example if the movie name is 'Paris', then the path constructed will be 'backend/Controllers/../Content/Paris', equivalent to 'backend/Content/Paris'.

```js

    const pathName = require('path').join( __dirname, '../Content', title );
```

Now create the Paris directory, in the Content folder. After that, create the document-object model in the database. And after that, store the video files in the Content folder. The files are stored in the request.files object. We will first convert the object into an array by using the 'Object.values' method and then loop through that array, each time saving each file. After that, send response to the frontend, that the operations are completed.

```js

    fs.mkdir( pathName, function ( err )
    {
        if ( err ) return;

        movies.create({

            path: path.join('../Content', title ),
            type, category, title, rating: 0

        }).then(

            function ( )
            {
                Object.values( request.files ).map(

                    function ( file ) {

                        file.mv( path.join( pathName, file.name ) );
                    }
                );

                reponse.send({ success: true });
            }
        )
    }
```

## Managing user registration

Now it's time to manage the user registration ! The user can either login or signup. First extract the details sent from frontend, from request.body.

<span>/Controllers/upload.js</span>

```js

    module.exports = function ( request, response )
    {
        const [ status,email,password ] = Object.values( request.body );
    }
```

I am using Object.values and converting the request.body object  to an array, so that i can extract the details easily by array destructuring. Otherwise, normally it is written like :

```js

    const { status, email, password } = {

        request.body.status,
        request.body.email,
        request.body.password
    };
```

After extracting the details, we will check whether the email exists in our database or not.

```js

    users.findOne({ email }).then(

        function ( result )
        {}
    );
```

If the email is found not to be pre-existing in the database, there can be 2 cases:

* The user is signing-up. In that case, it is fine. Because nobody has registered previously with that email.

* The user is logging-in. Then we should provide error, because the email doesnt exist in database.

```js

    if( result === null ) {

        status === 'Login'
          ? response.send({ error: true })
          : users.create({ email, password }).then(

            function ( user ) {

                response.send({ _id: user._id });
            }
            )
    }
```

If the email, pre-exists in the database, then again we will check for 2 cases :

* If auth-status is login, then we will check whether the password provided by the user matches or not. If it matches, we send response as { success: true }, otherwise we send { error: true }.

* If auth status is signup, then we will send { error: true } because, someone has already registered with that email.

```js

    else {

        if( status === 'Login' ) {

            password === result.password
              ? response.send({ _id: result._id })
              : response.send({ error: true })

        }
        
        else {

            response.send({ error: true });
        }
    }
```

## Accessing a movie

When from the frontend, request is received to access files related to a movie :

First access the title of the movie from the request.body

<span>/Controllers/getMovie.js</span>

```js

    module.exports = function ( request, response )
    {
        const title = request.body.title;
    }
```

Then search for the movie title in the database :

```js

    movies.findOne({ title: request.body.title }).then(

        function ( movie )
        {}
    );
```

If nothing is found in the database, then send error message :

```js

    if( movie === null 
    {

        response.send({ error: true });
    }
```

Otherwise, first construct the path where the movie files are stored. Then read all the files from that folder and store the files in an array.

```js

    else
    {
        const filePath = path.join( __dirname, movie.path );

        const files = fs.readdirSync( filePath );
    }
```

After this, count the number of preview-photos and episodes present for the movie.

```js

    var list = [], count = 0;
    var episodes = [], episodeCount = 0;

    files.forEach(

        function ( file, index ) {

            file.includes('Photo') && list.push( ++count );
            file.includes('Episode') && episodes.push( ++ episodeCount );
        }
    );
```

Then send this object as response to the frontend. We construct this object, by first parsing the files  and converting to base-64 format and then assigning them to different object fields :

```js

    response.send({

        cover: fs.readFileSync( path.join( filePath, '/Cover.jpg' ), { encoding: 'base64' } ),
        description: fs.readFileSync( path.join( filePath, '/Description.txt' ), { encoding: 'utf8' } ),
        photos: list.map(

            index => fs.readFileSync( path.join( filePath, '/Photo' + index + '.jpg' ), { encoding: 'base64' } )
        ),
        episodeCount: episodes
    });
```

## Sending Movie Preview

This controller function is used, to send movie-trailers to the frontend. First we access the movie title from the request.query. Then we construct the file path where the preview is stored. Then we read and send the preview video as a stream of data. Also before we send the stream of data, we need to add some options to the response header, which denotes, that we are sending some buffer data in response.

<span>/Controllers/getPreview.js</span>

```js

    const title = request.query.title;
    const filePath = path.join( __dirname, `../Content/${ title }/Preview.mp4` );

    //header options
    const headers = {

        'Content-Type': 'video/mp4',
        'Content-Length': fs.statSync( filePath ).size
    };
    response.writeHead( 200, headers );

    // send the video in response as stream of data
    fs.createReadStream( filePath ).pipe( response );
```

## Sending Movie episodes

The same way in which we sent the preview, we will send the episode video file.

<span>/Controllers/getEpisode.js</span>

```js

    module.exports = function ( request, response ) {
    
        const { title, episode } = request.query
    
        const filePath = path.join( __dirname, `../Content/${ title }/Episode${ episode }.mp4` );
    
        const headers = {
    
            'Content-Type': 'video/mp4',
            'Content-Length': fs.statSync( filePath ).size
        };
        response.writeHead( 200, headers );
    
        fs.createReadStream( filePath ).pipe( response );
    }
```

## Send list of movies for a definite type

To send the list of movies, for a definite category, first we extract the details sent to us from the request.body object.

<span>/Controllers/getListCategory.js</span>

```js

    module.exports = function ( request, response )
    {

        const category = request.query.category;
    }
```

Now in our database, we search for all the movies belonging to the required category.

```js

    movies.find({ category }).then(

        function ( result )
        {}
    )
```

We get an array of the movies passed to our callback function, as a parameter. After that we perform some operations, like encoding the cover image of each movie in base-64 format by looping through the array and send the resultant array as response.

```js

    response.send(

        /*
            Looping through each item in that array. This method will return us an array.
        */
        result.map(

            // We take each item of the array as parameter
            movie => {

                return {

                    photo: fs.readFileSync(

                        path.join( __dirname, movie.path+'/Cover.jpg' ),
                        { encoding: 'base64' }
                    ),

                    title: movie.title,
                    rating: movie.rating
                };
            }
        )
    );
```

<div class = "center">-----The End------</div>