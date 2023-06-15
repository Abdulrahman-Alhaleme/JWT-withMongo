const mongoose = require('mongoose')
const joi = require("joi")

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        maxlength: 200,
        unique: true
    },
    userName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 200,

    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,

    },
    isAdmin: {
        type: Boolean,
        default: false

    },
    Image: {
        type: String,
        default: "default-avatar.png"
    }
}, {
    timestamps: true
})
// user model
const User = mongoose.model("User", userSchema);
// validate register user
function validaterRgisterUser(obj) {

    const schema = joi.object({
        email: joi.string().trim().min(8).max(200).required().email(),
        userName: joi.string().trim().min(3).max(200).required(),
        password: joi.string().trim().min(6).max(200).required(),
        isAdmin: joi.bool(),
    })
    return schema.validate(obj);
}
// validate login user
function validaterLoginUser(obj) {

    const schema = joi.object({
        email: joi.string().trim().min(8).max(200).required().email(),

        password: joi.string().trim().min(6).max(200).required(),

    })
    return schema.validate(obj);
}

module.exports = {
    User,
    validaterLoginUser,
    validaterRgisterUser
}