
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Appointment = require('./models/Appointment');

dotenv.config();

const checkAppointments = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const appointments = await Appointment.find({}).populate('user');
        console.log('--- APPOINTMENTS ---');
        appointments.forEach(apt => {
            console.log(`ID: ${apt._id}`);
            console.log(`User: ${apt.user ? apt.user.name : 'Unknown'}`);
            console.log(`Status: ${apt.status}`);
            console.log(`Date: ${apt.date}`);
            console.log(`VisitedAt: ${apt.visitedAt}`);
            console.log('---');
        });

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkAppointments();
