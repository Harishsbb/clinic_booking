const Appointment = require('../models/Appointment');

const Doctor = require('../models/Doctor');

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
        res.json(appointment);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.getAppointments = async (req, res) => {
    try {
        const { userId } = req.query;
        const query = userId ? { user: userId } : {};
        const appointments = await Appointment.find(query).populate('doctor').populate('user');
        res.json(appointments);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};
