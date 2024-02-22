require("dotenv").config()

const mongoose = require("mongoose");

mongoose.set("debug", true)
mongoose.Promise = global.Promise;
try {
   mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => console.log(`MongoDB connected`)).catch((err) => console.log(`Error ${err}`))
} catch (error) {
    console.error(error)
}

module.exports.Auth = require("./auth")