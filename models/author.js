const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const authorSchema = new Schema({
    name: String,
    age: Number
})

//model defined as Author and authorSchema to be used(2nd arg)
module.exports = mongoose.model('Author', authorSchema);

