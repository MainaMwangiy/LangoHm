require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
        rejectUnauthorized: false
    }
});


const testDBConnection = async () => {
    try {
        const res = await pool.query('SELECT NOW()');
        console.log('Connection to database has been established successfully at:', res.rows[0].now);
    } catch (err) {
        console.error('Unable to connect to the database:', err.stack);
    }
};


testDBConnection();

const executeQuery = async (sql, params = []) => {
    const client = await pool.connect();
    try {
        const res = await client.query(sql, params);
        return res.rows;
    } catch (err) {
        console.error(err.stack);
    } finally {
        client.release();
    }
};

module.exports = { executeQuery, testDBConnection };
