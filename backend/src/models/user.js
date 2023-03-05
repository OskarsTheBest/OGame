const mongoose = require('mongoose')

// Defines the schema object from mongoose
const Schema = mongoose.Schema

// Defines the user schema
const userSchema = new Schema({
  username: {
    type: String,
    require: true,
    unique: true,
  }
})

module.exports = mongoose.model('users', userSchema)