const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    specialty: { type: String, required: true },
    bio: { type: String },
    fee: { type: Number, required: true, default: 100 },
    image: { type: String },
    availability: [{ type: String }], // e.g., ["Monday 10am-2pm"]
    docId: { type: Number, unique: true },
    hospital: { type: String },
    district: { type: String }
});

module.exports = mongoose.model('Doctor', DoctorSchema);
