const pool = require('../config/database');

exports.getMeetings = async (req, res) => {
    try {
        const meetings = await pool.query('SELECT * FROM meetings WHERE manager_id = $1 OR employee_id = $1', [req.user.userId]);
        res.json(meetings.rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteMeeting = async (req, res) => {
  const { id } = req.params;
  try {
      // Deleting the meeting from the database
      await pool.query('DELETE FROM meetings WHERE id = $1', [id]);
      res.json({ message: 'Meeting deleted successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Server error' });
  }
};


exports.createMeeting = async (req, res) => {
    const { title, description, managerId, employeeId, startTime, endTime, locationLatitude, locationLongitude, locationAddress } = req.body;
    try {
        await pool.query('INSERT INTO meetings (title, description, manager_id, employee_id, start_time, end_time, location_latitude, location_longitude, location_address) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', 
                        [title, description, managerId, employeeId, startTime, endTime, locationLatitude, locationLongitude, locationAddress]);
        res.status(201).json({ message: 'Meeting created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateMeeting = async (req, res) => {
    const { id } = req.params;
    const { title, description, startTime, endTime, locationLatitude, locationLongitude, locationAddress } = req.body;
    try {
        await pool.query('UPDATE meetings SET title = $1, description = $2, start_time = $3, end_time = $4, location_latitude = $5, location_longitude = $6, location_address = $7 WHERE id = $8',
                        [title, description, startTime, endTime, locationLatitude, locationLongitude, locationAddress, id]);
        res.json({ message: 'Meeting updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.cancelMeeting = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('UPDATE meetings SET status = $1 WHERE id = $2', ['cancelled', id]);
        res.json({ message: 'Meeting cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
