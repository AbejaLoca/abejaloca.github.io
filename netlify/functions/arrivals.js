const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.NEON_DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Helper function to ensure table exists
async function ensureTableExists() {
    const client = await pool.connect();
    try {
        await client.query(`
      CREATE TABLE IF NOT EXISTS arrivals (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        image_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
        console.log('Arrivals table verified');
    } catch (err) {
        console.error('Error ensuring table exists:', err);
        throw err;
    } finally {
        client.release();
    }
}

exports.handler = async (event, context) => {
    // First ensure table exists
    try {
        await ensureTableExists();
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Database configuration error',
                details: err.message
            }),
        };
    }

    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'CORS preflight' })
        };
    }

    try {
        if (event.httpMethod === 'GET') {
            const { rows } = await pool.query('SELECT * FROM arrivals ORDER BY created_at DESC');
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(rows),
            };
        }

        if (event.httpMethod === 'POST') {
            const { title, description, price, image_url } = JSON.parse(event.body);
            const { rows } = await pool.query(
                `INSERT INTO arrivals (title, description, price, image_url) 
         VALUES ($1, $2, $3, $4) 
         RETURNING *`,
                [title, description, price, image_url]
            );
            return {
                statusCode: 201,
                headers,
                body: JSON.stringify(rows[0]),
            };
        }

        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method Not Allowed' }),
        };
    } catch (err) {
        console.error('Database operation failed:', err);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Database operation failed',
                details: err.message,
                hint: 'If seeing "relation does not exist", wait 60 seconds and try again'
            }),
        };
    }
};