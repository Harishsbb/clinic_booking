
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Doctor = require('./models/Doctor');
const bcrypt = require('bcryptjs');

dotenv.config();

const simplifyDoctors = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const doctors = await Doctor.find({});
        console.log('--- UPDATING DOCTOR CREDENTIALS ---');

        for (const doc of doctors) {
            // Extract a simple name (e.g., "Dr. K. Raju" -> "raju")
            // Remove "Dr.", remove dots, split by space, take the last part which is usually the name
            const nameParts = doc.name.replace('Dr.', '').replace(/\./g, '').trim().split(' ');
            const simpleName = nameParts[nameParts.length - 1].toLowerCase();

            const newEmail = `${simpleName}@clinic.com`;
            const newPassword = '12345';

            doc.email = newEmail;
            doc.password = newPassword; // Pre-save hook will hash this

            await doc.save();

            console.log(`Name: ${doc.name}`);
            console.log(`New Email: ${newEmail}`);
            console.log(`New Password: ${newPassword}`);
            console.log('---');
        }

        console.log('All doctors updated successfully.');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

simplifyDoctors();
