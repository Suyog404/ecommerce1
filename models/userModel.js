const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: Number,
        default: 0
    },
    passwordResetExpiry: Date,
    activation: {
        type: String,
        default: 'pending'
    },
    activeCode: {
        type: String
    },
    activationExpiry: Date,
    cart: {
        type: Array,
        default: []
    }
}, {
    timestamps: true

})

module.exports = mongoose.model('Users', userSchema)