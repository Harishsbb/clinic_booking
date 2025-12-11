
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Doctor = require('./models/Doctor');
const bcrypt = require('bcryptjs');

dotenv.config();

const updateDoctors = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const doctors = await Doctor.find();
        console.log(`Found ${doctors.length} doctors.`);

        for (const doc of doctors) {
            if (!doc.email || !doc.password) {
                // Generate a simple email: firstname.lastname@clinic.com
                const email = `${doc.name.toLowerCase().replace(/\s+/g, '.')}@clinic.com`;
                const password = 'password123'; // Default password

                // Hash password manually since we might bypass pre-save hook depending on how we update, 
                // but let's use doc.save() to trigger the hook we just added.
                doc.email = email;
                doc.password = password;
                // Note: The pre-save hook will hash this.

                await doc.save();
                console.log(`Updated Dr. ${doc.name}: Email=${email}, Password=${password}`);
            } else {
                console.log(`Dr. ${doc.name} already has credentials.`);
            }
        }

        console.log('All doctors updated.');
        process.exit();
    } catch (error) {
        console.error('Error updating doctors:', error);
        process.exit(1);
    }
};

updateDoctors();
