const pool = require('../config/database');

exports.getUsers = async (req, res) => {
    try {
        const users = await pool.query('SELECT * FROM users');
        res.json(users.rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createUser = async (req, res) => {
    const { email, password, firstName, lastName, role, managerId } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO users (email, password, role, first_name, last_name, manager_id) VALUES ($1, $2, $3, $4, $5, $6)', 
                        [email, hashedPassword, role, firstName, lastName, managerId]);
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { email, firstName, lastName, role, isActive } = req.body;
    try {
        await pool.query('UPDATE users SET email = $1, first_name = $2, last_name = $3, role = $4, is_active = $5 WHERE id = $6',
                        [email, firstName, lastName, role, isActive, id]);
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM users WHERE id = $1', [id]);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
