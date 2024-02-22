require('dotenv').config();
const Sequelize = require("sequelize");

const db = {};
const sequelize = new Sequelize(process.env.POSTGRES_URL, {
    dialect: "postgres",

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

sequelize
    .authenticate()
    .then(() => {
        console.log("Connection has been established successfully.");
    })
    .catch(err => {
        console.error("Unable to connect to the database:", err);
    });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
