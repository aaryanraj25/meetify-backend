const queries = {
    // User queries
    createUser: `
      INSERT INTO users (email, password, role, first_name, last_name, manager_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, email, role, first_name, last_name;
    `,
    
    getUserByEmail: `
      SELECT * FROM users WHERE email = $1 AND is_active = true;
    `,
    
    getManagerEmployees: `
      SELECT id, email, first_name, last_name, created_at
      FROM users
      WHERE manager_id = $1 AND role = 'employee' AND is_active = true;
    `,
    
    // Meeting queries
    createMeeting: `
      INSERT INTO meetings (
        title, description, manager_id, employee_id,
        start_time, end_time, location_latitude,
        location_longitude, location_address
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `,
    
    updateMeetingStatus: `
      UPDATE meetings
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2 AND manager_id = $3
      RETURNING *;
    `,
    
    getMeetingsByUser: `
      SELECT m.*, 
             u1.first_name as manager_first_name,
             u1.last_name as manager_last_name,
             u2.first_name as employee_first_name,
             u2.last_name as employee_last_name
      FROM meetings m
      JOIN users u1 ON m.manager_id = u1.id
      JOIN users u2 ON m.employee_id = u2.id
      WHERE (m.manager_id = $1 OR m.employee_id = $1)
      AND start_time >= $2
      AND status = COALESCE($3, status)
      ORDER BY start_time;
    `,
    
    // Location queries
    updateLocation: `
      INSERT INTO locations (user_id, latitude, longitude)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id)
      DO UPDATE SET
        latitude = EXCLUDED.latitude,
        longitude = EXCLUDED.longitude,
        last_updated = CURRENT_TIMESTAMP;
    `,
    
    getEmployeeLocations: `
      SELECT u.id, u.first_name, u.last_name, l.latitude, l.longitude, l.last_updated
      FROM users u
      LEFT JOIN locations l ON u.id = l.user_id
      WHERE u.manager_id = $1 AND u.role = 'employee' AND u.is_active = true;
    `,
  };
  
  module.exports = queries;