const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    initial: { type: String },
    specialty: { type: String, required: true },
    bio: { type: String },
    fee: { type: Number, required: true, default: 100 },
    image: { type: String },
    availability: [{ type: String }], // e.g., ["Monday 10am-2pm"]
    docId: { type: Number, unique: true },
    hospital: { type: String },
    district: { type: String },
    email: { type: String, unique: true, sparse: true }, // sparse: true allows existing docs to lack email initially
    password: { type: String },
    role: { type: String, default: 'doctor' }
});

DoctorSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

DoctorSchema.methods.matchPassword = async function (enteredPassword) {
    const bcrypt = require('bcryptjs');
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Doctor', DoctorSchema);
