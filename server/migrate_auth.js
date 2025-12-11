const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Doctor = require('./models/Doctor');
const DoctorAuth = require('./models/DoctorAuth');

dotenv.config();

const migrateAuth = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const doctors = await Doctor.find({});
        console.log('--- MIGRATING DOCTOR CREDENTIALS ---');

        for (const doc of doctors) {
            // Check if auth already exists
            const existingAuth = await DoctorAuth.findOne({ doctor: doc._id });
            if (existingAuth) {
                console.log(`Auth already exists for ${doc.name}`);
                continue;
            }

            // Create new auth
            // Ensure email exists
            let email = doc.email;
            if (!email) {
                // Generate email if missing
                const nameParts = doc.name.replace('Dr.', '').replace(/\./g, '').trim().split(' ');
                const simpleName = nameParts[nameParts.length - 1].toLowerCase();
                email = `${simpleName}@clinic.com`;
            }

            const newAuth = new DoctorAuth({
                doctor: doc._id,
                email: email,
                password: '12345' // Default password, will be hashed by pre-save hook
            });

            await newAuth.save();
            console.log(`Migrated: ${doc.name} -> ${email}`);
        }

        console.log('Migration completed successfully.');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

migrateAuth();
