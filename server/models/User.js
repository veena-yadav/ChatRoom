const mongoose = require('mongoose');
const {isEmail}= require('validator')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'please enter a name']
    },
    email:{
        type: String,
        required: [true, 'please enter a email'],
        lowercase: true,
        unique: true,
        validate:[isEmail, 'Please enter a valid Email']
    },
    password:{
        type: String,
        required: [true, 'please enter a your password'],
        minlength: [6, 'password should be grater then 6 digits']
    }
})

const User = mongoose.model('user', userSchema)
module.exports = User;