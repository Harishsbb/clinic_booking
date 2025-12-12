
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

const { sendBookingConfirmation } = require('../utils/emailService');

exports.createAppointment = async (req, res) => {
    try {
        let { userId, doctorId, date } = req.body;

        // Check if doctorId is a number (docId) and resolve to _id
        if (!isNaN(doctorId)) {
            const doctor = await Doctor.findOne({ docId: doctorId });
            if (!doctor) {
                return res.status(404).json({ msg: 'Doctor not found' });
            }
            doctorId = doctor._id;
        }

        const appointment = new Appointment({
            user: userId,
            doctor: doctorId,
            date
        });
        await appointment.save();

        // Send Confirmation Email
        // Fetch user and doctor details for the email
        const user = await require('../models/User').findById(userId);
        const doctor = await Doctor.findById(doctorId);

        if (user && doctor) {
            const appointmentDate = new Date(date).toLocaleDateString();
            const appointmentTime = new Date(date).toLocaleTimeString();

            // Run asynchronously, don't block response
            sendBookingConfirmation(user.email, {
                patientName: user.name,
                doctorName: doctor.name,
                date: appointmentDate,
                time: appointmentTime
            });
        }

        res.json(appointment);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.getAppointments = async (req, res) => {
    try {
        const { doctorId, userId } = req.query;
        let query = {};
        if (doctorId) {
            query.doctor = doctorId;
        }
        if (userId) {
            query.user = userId;
        }
        // Populate user details for doctor view, and doctor details for patient view if needed
        const appointments = await Appointment.find(query)
            .populate('user', 'name email')
            .populate('doctor', 'name availability fee');

        res.json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ msg: 'Appointment not found' });
        }

        appointment.status = status;
        if (status === 'completed') {
            appointment.visitedAt = new Date();
        }
        await appointment.save();
        res.json(appointment);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.deleteAppointment = async (req, res) => {
    try {
        await Appointment.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Appointment deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.updateAppointment = async (req, res) => {
    try {
        const { date, status } = req.body;
        let updateData = { date, status };
        if (status === 'completed') {
            updateData.visitedAt = new Date();
        }

        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        res.json(appointment);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

