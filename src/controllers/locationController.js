const pool = require('../config/database');

exports.updateLocation = async (req, res) => {
    const { userId, latitude, longitude } = req.body;
    try {
        await pool.query('INSERT INTO locations (user_id, latitude, longitude) VALUES ($1, $2, $3)', 
                        [userId, latitude, longitude]);
        res.status(201).json({ message: 'Location updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getLocation = async (req, res) => {
    const { id } = req.params;
    try {
        const location = await pool.query('SELECT * FROM locations WHERE user_id = $1 ORDER BY last_updated DESC LIMIT 1', [id]);
        res.json(location.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
