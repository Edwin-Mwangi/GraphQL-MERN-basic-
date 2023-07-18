const mongoose = require('mongoose');
//schema declaration
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    name: String,
    genre: String,
    authorId: String
})

//model defined as Book and bookSchema to be used(2nd arg)
module.exports = mongoose.model('Book', bookSchema);

