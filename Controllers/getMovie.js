const { movies, users } = require ("../Database/schema");
const fs = require('fs');
const path = require('path');

module.exports = function ( request, response ) {

    movies.findOne({ title: request.body.title }).then(

        function ( movie ) {

            if( movie === null ) {

                response.send({ error: true });
            } else {

                const filePath = path.join( __dirname, movie.path );

                const files = fs.readdirSync( filePath );

                var list = [], count = 0;
                var episodes = [], episodeCount = 0;

                files.forEach(

                    function ( file, index ) {

                        file.includes('Photo') && list.push( ++count );
                        file.includes('Episode') && episodes.push( ++ episodeCount );
                    }
                );

                users.findById( request.body._id ).then(

                    function ( user ) {

                        var userRating = 0;

                        for ( var i = 0; i< user.ratings.length; i++ ) {

                            if ( user.ratings[i].title === request.body.title ) {

                                userRating = user.ratings[i].rating;
                            }
                        }

                        response.send({

                            cover: fs.readFileSync( path.join( filePath, '/Cover.jpg' ), { encoding: 'base64' } ),
                            description: fs.readFileSync( path.join( filePath, '/Description.txt' ), { encoding: 'utf8' } ),
                            photos: list.map(
        
                                index => fs.readFileSync( path.join( filePath, '/Photo' + index + '.jpg' ), { encoding: 'base64' } )
                            ),
                            episodeCount: episodes,
                            rating: movie.rating,
                            userRating
                        });
                    }
                );
            }
        }
    )
}