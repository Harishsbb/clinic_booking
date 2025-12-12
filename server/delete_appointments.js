
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Appointment = require('./models/Appointment');

dotenv.config();

const deleteAllAppointments = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const result = await Appointment.deleteMany({});
        console.log(`Deleted ${result.deletedCount} appointments.`);

        console.log('All appointments have been removed.');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

deleteAllAppointments();
