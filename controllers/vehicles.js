const { executeQuery } = require("../models");

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

exports.getUserVehicleDetails = async (req, res, next) => {
    const { id } = { ...req.params, ...req.body, ...req.query }
    try {
        const sql = `SELECT * FROM vehicles WHERE user_id = '${id}'`;
        const vehicle = await executeQuery(sql)
        if (vehicle) {
            res.status(200).json({
                success: true,
                message: "Vehicle Loaded Successfully",
                data: vehicle
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
}