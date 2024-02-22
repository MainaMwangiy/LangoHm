const { executeQuery } = require('./index');

const createVehicle = async (vehicle) => {
    const { name, description, image_url } = vehicle;
    const sql = `INSERT INTO vehicles (name, description, image_url) VALUES ($1, $2, $3) RETURNING *;`;
    return await executeQuery(sql, [name, description, image_url]);
};

const getAllVehicles = async () => {
    const sql = `SELECT * FROM vehicles;`;
    return await executeQuery(sql);
};

const getVehicleById = async (id) => {
    const sql = `SELECT * FROM vehicles WHERE id = $1;`;
    return await executeQuery(sql, [id]);
};

const updateVehicle = async (id, vehicle) => {
    const { name, description, image_url } = vehicle;
    const sql = `UPDATE vehicles SET name = $2, description = $3, image_url = $4 WHERE id = $1 RETURNING *;`;
    return await executeQuery(sql, [id, name, description, image_url]);
};

const deleteVehicle = async (id) => {
    const sql = `DELETE FROM vehicles WHERE id = $1 RETURNING *;`;
    return await executeQuery(sql, [id]);
};

module.exports = {
    createVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle
};
