const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const reviewSchema = new Schema({
    body : String,
    rating : Number
});


module.exports = mongoose.model("Review", reviewSchema);