const mongoose = require('mongoose');
const {isEmail}= require('validator');
const bcrypt = require('bcrypt');

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
// bcrypt is using to hide password
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);

    next()
})
// userSchema.post('save', function(doc, next){
//     console.log('after save', doc)
//     next()
// })
const User = mongoose.model('user', userSchema)
module.exports = User;