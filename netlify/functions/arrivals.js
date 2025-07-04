const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.NEON_DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

exports.handler = async (event, context) => {
    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    };

    // Handle OPTIONS request for CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'CORS preflight' })
        };
    }

    if (event.httpMethod === 'GET') {
        try {
            const { rows } = await pool.query('SELECT * FROM arrivals ORDER BY created_at DESC');
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(rows),
            };
        } catch (err) {
            console.error('Database error:', err);
            return {
                statusCode: 500,
                headers,
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
                headers,
                body: JSON.stringify(rows[0]),
            };
        } catch (err) {
            console.error('Database error:', err);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: err.message }),
            };
        }
    }

    return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
};