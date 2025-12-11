
const Doctor = require('../models/Doctor');
const DoctorAuth = require('../models/DoctorAuth');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check DoctorAuth collection
        const doctorAuth = await DoctorAuth.findOne({ email });

        if (doctorAuth && (await doctorAuth.matchPassword(password))) {
            // Fetch full doctor details
            const doctor = await Doctor.findById(doctorAuth.doctor);

            if (!doctor) {
                return res.status(404).json({ message: 'Doctor profile not found' });
            }

            res.json({
                _id: doctor._id,
                name: doctor.name,
                email: doctorAuth.email, // Use email from auth
                role: doctor.role,
                token: generateToken(doctor._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
