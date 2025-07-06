const { Pool } = require('pg');

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        const data = JSON.parse(event.body);

        const productRes = await pool.query(
            `INSERT INTO products
             (title, description, genre, price, image_url, stripe_button_id, stripe_publishable_key)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
            [
                data.title,
                data.description,
                data.genre,
                data.price,
                data.image_url,
                data.stripe_button_id,
                data.stripe_publishable_key
            ]
        );

        const productId = productRes.rows[0].id;

        for (const [index, track] of data.tracklist.entries()) {
            const [trackName, ...rest] = track.split(' - ');
            const trackDesc = rest.join(' - ');

            await pool.query(
                `INSERT INTO tracks
                     (product_id, track_name, description, position)
                 VALUES ($1, $2, $3, $4)`,
                [productId, trackName.trim(), trackDesc.trim(), index + 1]
            );
        }

        return {
            statusCode: 201,
            body: JSON.stringify({ success: true, productId }),
        };
    } catch (error) {
        return { statusCode: 500, body: error.toString() };
    } finally {
        await pool.end();
    }
};