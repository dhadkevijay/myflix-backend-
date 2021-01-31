const { users, movies } = require('../Database/schema');

module.exports = function ( request, response ) {

    const { title, rating, _id } = request.body;

    users.findById( _id ).then(

        function ( user ) {

            const ratings = user.ratings;
            var updated = false;

            for ( var i=0; i< ratings.length; i++ ) {

                if ( ratings[i].title === title ) {

                    ratings[i].rating= rating
                    updated = true;
                }
            }

            if ( !updated ) {

                ratings.push({ title, rating });
            }

            users.updateOne({_id}, { ratings }).then(

                ( ) => response.send({ success: true })
            );
        }
    )
}