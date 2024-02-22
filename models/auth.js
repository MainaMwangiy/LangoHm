const mongoose = require("mongoose")
const uuid = require("uuid");

const AuthSchema = new mongoose.Schema({
    id: {
        type: String,
        default: uuid.v1,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    deleted: {
        type: Boolean
    }
})

module.exports = mongoose.model("Auth", AuthSchema)