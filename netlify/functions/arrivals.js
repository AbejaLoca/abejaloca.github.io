const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.NEON_DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

exports.handler = async (event, context) => {
    if (event.httpMethod === 'GET') {
        try {
            const { rows } = await pool.query('SELECT * FROM arrivals ORDER BY created_at DESC');
            return {
                statusCode: 200,
                body: JSON.stringify(rows),
            };
        } catch (err) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: err.message }),
            };
        }
    }

    if (event.httpMethod === 'POST') {
        try {
            const { title, description, price, image_url } = JSON.parse(event.body);
            const { rows } = await pool.query(
                'INSERT INTO arrivals (title, description, price, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
                [title, description, price, image_url]
            );
            return {
                statusCode: 201,
                body: JSON.stringify(rows[0]),
            };
        } catch (err) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: err.message }),
            };
        }
    }

    return {
        statusCode: 405,
        body: 'Method Not Allowed',
    };
};