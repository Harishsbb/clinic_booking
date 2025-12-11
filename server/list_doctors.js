
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Doctor = require('./models/Doctor');

dotenv.config();

const listDoctors = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const doctors = await Doctor.find({}, 'name email');
        console.log('--- DOCTOR CREDENTIALS ---');
        console.log('Password for all: password123');
        console.log('--------------------------');
        doctors.forEach(doc => {
            console.log(`Name: ${doc.name}`);
            console.log(`Email: ${doc.email}`);
            console.log('---');
        });

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

listDoctors();
