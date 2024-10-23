const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
      const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (user.rowCount === 0) return res.status(400).json({ message: 'User not found' });

      const isValid = await bcrypt.compare(password, user.rows[0].password);
      if (!isValid) return res.status(400).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ userId: user.rows[0].id, role: user.rows[0].role }, process.env.JWT_SECRET);
      res.json({ token });
  } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
  }
};



exports.register = async (req, res) => {
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
