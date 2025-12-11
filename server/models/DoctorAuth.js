const mongoose = require('mongoose');

const DoctorAuthSchema = new mongoose.Schema({
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// Hash password before saving
DoctorAuthSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match password method
DoctorAuthSchema.methods.matchPassword = async function (enteredPassword) {
    const bcrypt = require('bcryptjs');
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('DoctorAuth', DoctorAuthSchema);
