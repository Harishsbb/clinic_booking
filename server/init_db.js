const pool = require('./db');

const createTables = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to database.');

        // Create doctors table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS doctors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        specialization VARCHAR(255),
        phone VARCHAR(50)
      )
    `);
        console.log('Table "doctors" created or already exists.');

        // Create patients table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS patients (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        age INT,
        phone VARCHAR(50)
      )
    `);
        console.log('Table "patients" created or already exists.');

        // Create schedules table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS schedules (
        id INT AUTO_INCREMENT PRIMARY KEY,
        doctor_id INT NOT NULL,
        day_of_week VARCHAR(20),
        start_time TIME,
        end_time TIME,
        FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
      )
    `);
        console.log('Table "schedules" created or already exists.');

        // Create appointments table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        patient_id INT NOT NULL,
        doctor_id INT NOT NULL,
        date DATE NOT NULL,
        time TIME NOT NULL,
        FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
        FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
        UNIQUE KEY unique_booking (doctor_id, date, time)
      )
    `);
        console.log('Table "appointments" created or already exists.');

        connection.release();
        console.log('Database initialization complete.');
        process.exit(0);
    } catch (err) {
        console.error('Error initializing database:', err);
        process.exit(1);
    }
};

createTables();
