require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const environment = process.env.NODE_ENV === 'production';

const testDBConnection = async () => {
    try {
        const res = await pool.query('SELECT NOW()');
        console.log('Connection to database has been established successfully at:', res.rows[0].now);
    } catch (err) {
        console.error('Unable to connect to the database:', err.stack);
    }
};

if (!environment) {
    testDBConnection();
}

const executeQuery = async (sql, params = []) => {
    const client = await pool.connect();
    try {
        const res = await client.query(sql, params);
        return res.rows;
    } catch (error) {
        console.error({
            timestamp: new Date().toISOString(),
            type: 'SQLError',
            message: error.message,
            stack: error.stack,
            client,
        });
        console.log(`Database connection string: ${process.env.DATABASE_URL}`);
        if (error.stack) console.error(error.stack);
        res.status(500).json({
            success: false,
            message: "An error occurred during the login process.",
            error: error.message
        });
    } finally {
        client.release();
    }
};

module.exports = { executeQuery, testDBConnection };
