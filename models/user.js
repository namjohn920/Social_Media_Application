const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var userSchema = new Schema({
    fullname: {
        type: String,
        default:''
    },
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    email:{
        type: String,
        default: ''
    },
    image:{
        type:String,
        default: ''
    },
    phone: {
        type: Number
    },
    location: {
        type:String
    },

    fbTokens: Array,
    facebook: {
        type: String
    },
    google: {
        type: String
    },
    instagram: {
        type: String
    }
});

//for Mongoose model argument, first is collection and second is the schema
module.exports = mongoose.model('user', userSchema);
