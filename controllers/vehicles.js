const { executeQuery } = require("../models");
const Vehicle = require("../models/vehicles");

exports.ListVehicle = async (req, res, next) => {
    try {
        const sql = `SELECT * FROM vehicles`;
        const vehicles = await executeQuery(sql)
        if (vehicles) {
            res.status(200).json({
                success: true,
                message: "Vehicles Loaded Successfully",
                data: vehicles
            })
        }
    } catch (error) {
        if (error) {
            return res.json({
                success: false,
                errors: "No details found",
            });
        }
    }
};

