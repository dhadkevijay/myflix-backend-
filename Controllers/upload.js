const { movies } = require('../Database/schema');
const path = require('path');
const fs = require('fs');

module.exports = function ( request, response ) {

    const [ title, type, category ] = Object.values( request.body );

    const pathName = path.join( __dirname, '../Content', title );

    fs.mkdir( pathName, function ( err ) {

        if( err ) return;

        movies.create({

            path: path.join('../Content', title ), type, category, title, rating: 0

        }).then(

            function ( ) {

                Object.values( request.files ).map(

                    function ( file ) {

                        file.mv( path.join( pathName, file.name ) , function ( err ) {
        
                            if ( err ) return;
                        });
                    }
                );

                response.send({ success: true })
            }
        )
    })
}