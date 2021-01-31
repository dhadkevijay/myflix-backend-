const { users } = require('../Database/schema');

function addMonth ( date, month ) {

    date.setMonth( date.getMonth( ) + month );
    return date;
}

module.exports = function ( request, response ) {

    const [ status,email,password,plan ] = Object.values( request.body );

    users.findOne({ email }).then(

        function ( result ) {

            if( result === null ) {

                status === 'Login'
                  ? response.send({ error: true })
                  : users.create({ email, password, plan, planPurchaseDate: new Date( ) }).then(

                        function ( user ) {

                            response.send({ _id: user._id });
                        }
                    )
            } 
            if ( result !== null ) {

                if( status === 'Login' ) {

                    if ( password === result.password ) {

                        if ( (result.plan === 499 && addMonth( result.planPurchaseDate, 6 ) < Date.now( )) || (result.plan === 999 && addMonth( result.planPurchaseDate, 12 ) < Date.now( )) ) {

                            response.send({ expiredPlan: true })
                        }

                        else response.send({ _id: result._id  });
                    }

                } else {

                    response.send({ error: true });
                }
            }
        }
    )
}