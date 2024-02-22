require('dotenv').config();
const { executeQuery } = require('./index');

const createUser = async (user) => {
    const { name, email, role, password } = user;
    const sql = `INSERT INTO users (name, email, role, password) VALUES ($1, $2, $3, $4) RETURNING *;`;
    return await executeQuery(sql, [name, email, role, password]);
};

const getAllUsers = async () => {
    const sql = `SELECT * FROM users;`;
    return await executeQuery(sql);
};

const getUserById = async (id) => {
    const sql = `SELECT * FROM users WHERE id = $1;`;
    return await executeQuery(sql, [id]);
};

const updateUser = async (id, user) => {
    const { name, email, role, password } = user;
    const sql = `UPDATE users SET name = $2, email = $3, role = $4, password = $5 WHERE id = $1 RETURNING *;`;
    return await executeQuery(sql, [id, name, email, role, password]);
};

const deleteUser = async (id) => {
    const sql = `DELETE FROM users WHERE id = $1 RETURNING *;`;
    return await executeQuery(sql, [id]);
};


module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};
