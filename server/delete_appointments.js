
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Appointment = require('./models/Appointment');

dotenv.config();

const deleteFirstTwoAppointments = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Find all appointments
        const appointments = await Appointment.find({});

        if (appointments.length < 2) {
            console.log('Less than 2 appointments found. Deleting all...');
        } else {
            console.log(`Found ${appointments.length} appointments. Deleting the first 2...`);
        }

        // Delete the first 2
        const toDelete = appointments.slice(0, 2);

        for (const apt of toDelete) {
            await Appointment.findByIdAndDelete(apt._id);
            console.log(`Deleted appointment with ID: ${apt._id} (Date: ${apt.date})`);
        }

        console.log('Deletion complete.');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

deleteFirstTwoAppointments();
