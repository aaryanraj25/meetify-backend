CREATE DATABASE meetify;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('super_admin', 'manager', 'employee') NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    manager_id INTEGER REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_manager_role CHECK (
        (role = 'employee' AND manager_id IS NOT NULL) OR
        (role != 'employee' AND manager_id IS NULL)
    )
);

CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE meetings (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    manager_id INTEGER REFERENCES users(id),
    employee_id INTEGER REFERENCES users(id),
    status ENUM('pending', 'approved', 'rejected', 'cancelled') DEFAULT 'pending',
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    location_latitude DECIMAL(10, 8),
    location_longitude DECIMAL(11, 8),
    location_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_meeting_times CHECK (end_time > start_time)
);

CREATE INDEX idx_users_manager_id ON users(manager_id);
CREATE INDEX idx_meetings_manager_id ON meetings(manager_id);
CREATE INDEX idx_meetings_employee_id ON meetings(employee_id);
CREATE INDEX idx_meetings_start_time ON meetings(start_time);