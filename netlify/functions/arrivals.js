const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.NEON_DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Update the arrivals table to use bytea for image storage
async function ensureTableExists() {
    const client = await pool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS arrivals (
                                                    id SERIAL PRIMARY KEY,
                                                    title VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                image_data BYTEA,
                image_type VARCHAR(50),
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
    await ensureTableExists();

    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: JSON.stringify({ message: 'CORS preflight' }) };
    }

    try {
        if (event.httpMethod === 'GET') {
            const { rows } = await pool.query('SELECT id, title, description, price, image_type, created_at FROM arrivals ORDER BY created_at DESC');

            // Convert image data to base64 for each row
            const rowsWithImages = rows.map(row => ({
                ...row,
                image_url: row.image_type ? `data:${row.image_type};base64,${row.image_data.toString('base64')}` : null
            }));

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(rowsWithImages),
            };
        }

        if (event.httpMethod === 'POST') {
            const { title, description, price, image_data, image_type } = JSON.parse(event.body);

            const { rows } = await pool.query(
                `INSERT INTO arrivals (title, description, price, image_data, image_type)
                 VALUES ($1, $2, $3, $4, $5)
                     RETURNING id, title, description, price, image_type, created_at`,
                [title, description, price, Buffer.from(image_data, 'base64'), image_type]
            );

            // Convert the returned row to include base64 image URL
            const result = {
                ...rows[0],
                image_url: `data:${rows[0].image_type};base64,${rows[0].image_data.toString('base64')}`
            };

            return {
                statusCode: 201,
                headers,
                body: JSON.stringify(result),
            };
        }

        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    } catch (err) {
        console.error('Database error:', err);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: err.message }),
        };
    }
};