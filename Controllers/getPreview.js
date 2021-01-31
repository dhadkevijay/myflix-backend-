const path = require('path');
const fs = require('fs');

module.exports = function ( request, response ) {

    const title = request.query.title;

    const filePath = path.join( __dirname, `../Content/${ title }/Preview.mp4` );

    const headers = {

        'Content-Type': 'video/mp4',
        'Content-Length': fs.statSync( filePath ).size
    };
    response.writeHead( 200, headers );

    fs.createReadStream( filePath ).pipe( response );
}