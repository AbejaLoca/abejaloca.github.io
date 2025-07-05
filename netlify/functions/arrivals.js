const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.NEON_DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Verify and update table structure on startup
async function verifyTableStructure() {
    const client = await pool.connect();
    try {
        // Check if columns exist
        const { rows } = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'arrivals'
    `);

        const columns = rows.map(row => row.column_name);

        // Add missing columns if needed
        if (!columns.includes('image_data')) {
            await client.query('ALTER TABLE arrivals ADD COLUMN image_data BYTEA');
        }
        if (!columns.includes('image_type')) {
            await client.query('ALTER TABLE arrivals ADD COLUMN image_type VARCHAR(50)');
        }

    } catch (err) {
        console.error('Error verifying table structure:', err);
        throw err;
    } finally {
        client.release();
    }
}

// Run verification when function loads
verifyTableStructure().catch(console.error);

exports.handler = async (event, context) => {
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
            const { rows } = await pool.query(`
        SELECT id, title, description, price, image_data, image_type, created_at 
        FROM arrivals 
        ORDER BY created_at DESC
      `);

            const rowsWithImages = rows.map(row => ({
                ...row,
                image_url: row.image_data ?
                    `data:${row.image_type};base64,${row.image_data.toString('base64')}` :
                    null
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
         RETURNING id, title, description, price, image_data, image_type, created_at`,
                [
                    title,
                    description,
                    price,
                    image_data ? Buffer.from(image_data, 'base64') : null,
                    image_type
                ]
            );

            const result = {
                ...rows[0],
                image_url: rows[0].image_data ?
                    `data:${rows[0].image_type};base64,${rows[0].image_data.toString('base64')}` :
                    null
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
            body: JSON.stringify({
                error: 'Database operation failed',
                details: err.message,
                hint: 'Please verify the database schema matches the expected structure'
            }),
        };
    }
};