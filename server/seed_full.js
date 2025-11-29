const pool = require('./db');

const seedData = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to database.');

        // 1. Create a Doctor
        const [doctorResult] = await connection.query(`
      INSERT INTO doctors (name, specialization, phone) 
      VALUES ('Dr. Strange', 'Neurologist', '555-0199')
    `);
        const doctorId = doctorResult.insertId;
        console.log(`Created Doctor: Dr. Strange (ID: ${doctorId})`);

        // 2. Create a Patient
        const [patientResult] = await connection.query(`
      INSERT INTO patients (name, age, phone) 
      VALUES ('Tony Stark', 45, '555-0100')
    `);
        console.log(`Created Patient: Tony Stark (ID: ${patientResult.insertId})`);

        // 3. Create Schedules for the Doctor
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        for (const day of days) {
            await connection.query(`
        INSERT INTO schedules (doctor_id, day_of_week, start_time, end_time) 
        VALUES (?, ?, '09:00:00', '17:00:00')
      `, [doctorId, day]);
        }
        console.log(`Created schedules for Dr. Strange for Mon-Fri`);

        connection.release();
        console.log('Seeding complete!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding data:', err);
        process.exit(1);
    }
};

seedData();
