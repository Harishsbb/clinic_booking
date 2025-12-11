const Doctor = require('../models/Doctor');

exports.getAllDoctors = async (req, res) => {
    try {
        const { hospital } = req.query;
        let query = {};
        if (hospital) {
            query.hospital = hospital;
        }
        const doctors = await Doctor.find(query).lean();
        res.json(doctors);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

const DoctorAuth = require('../models/DoctorAuth');

exports.createDoctor = async (req, res) => {
    try {
        // Find the highest docId
        const lastDoctor = await Doctor.findOne().sort({ docId: -1 });
        const nextDocId = lastDoctor && lastDoctor.docId ? lastDoctor.docId + 1 : 1;

        const { email, ...doctorData } = req.body;

        const newDoctor = new Doctor({
            ...doctorData,
            docId: nextDocId,
            email: email // Save email in Doctor model too for reference
        });
        const doctor = await newDoctor.save();

        // Create Auth entry
        if (email) {
            const newAuth = new DoctorAuth({
                doctor: doctor._id,
                email: email,
                password: '12345' // Default password
            });
            await newAuth.save();
        }

        res.json(doctor);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.updateDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(doctor);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.deleteDoctor = async (req, res) => {
    try {
        await Doctor.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Doctor deleted' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.updateAvailability = async (req, res) => {
    try {
        const { availability } = req.body;
        const doctor = await Doctor.findById(req.params.id);

        if (!doctor) {
            return res.status(404).json({ msg: 'Doctor not found' });
        }

        doctor.availability = availability;
        await doctor.save();
        res.json(doctor);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
