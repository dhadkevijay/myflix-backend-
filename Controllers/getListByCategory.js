const { movies } = require ("../Database/schema");
const fs = require('fs');
const path = require('path');

module.exports = function ( request, response ) {

    const category = request.query.category;

    movies.find({ category }).then(

        result => {

            response.send(

                result.map(

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
        }
    )
}