const { Pool } = require('pg');

exports.handler = async (event, context) => {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        const { rows } = await pool.query(`
            SELECT p.*,
                   json_agg(
                           json_build_object(
                                   'track_name', t.track_name,
                                   'duration', t.duration,
                                   'description', t.description
                           ) ORDER BY t.position
                   ) as tracklist
            FROM products p
                     LEFT JOIN tracks t ON p.id = t.product_id
            GROUP BY p.id
        `);

        return {
            statusCode: 200,
            body: JSON.stringify(rows),
        };
    } catch (error) {
        return { statusCode: 500, body: error.toString() };
    } finally {
        await pool.end();
    }
};