CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (name, email) VALUES 
('Diego Bermúdez', 'diegobermudez098@gmail.com'),
('Instructor Richard', 'richard.sena@sena.edu.co')
ON CONFLICT (email) DO NOTHING;
