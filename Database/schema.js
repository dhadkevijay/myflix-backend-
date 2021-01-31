const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(

    {

        email: {

            type: String,
            unique: true,
            required: true
        },

        password: {

            type: String,
            required: true
        },

        ratings: Schema.Types.Array,

        plan: {

            type: Schema.Types.Number,
            required: true
        },

        planPurchaseDate: {

            type: Schema.Types.Date,
            required: true
        }
    },

    {

        collection: 'users'
    }
);

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
        },

        rating: {

            type: Schema.Types.Number,
            required: true
        }
    },

    {

        collection: 'movies'
    }
)

module.exports = {

    users: mongoose.model( 'users', userSchema ),
    movies: mongoose.model( 'movies', moviesSchema )
};