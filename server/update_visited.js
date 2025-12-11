
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Appointment = require('./models/Appointment');

dotenv.config();

const updateVisitedAt = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Find the appointment for 'harish' (or the first completed one without visitedAt)
        const appointment = await Appointment.findOne({ status: 'completed', visitedAt: { $exists: false } });

        if (appointment) {
            appointment.visitedAt = new Date();
            await appointment.save();
            console.log(`Updated appointment ${appointment._id} with visitedAt: ${appointment.visitedAt}`);
        } else {
            console.log('No suitable appointment found to update.');
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

updateVisitedAt();
