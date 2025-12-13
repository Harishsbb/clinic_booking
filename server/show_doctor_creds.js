const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Doctor = require('./models/Doctor');
const DoctorAuth = require('./models/DoctorAuth');
const fs = require('fs');
const path = require('path');

dotenv.config();

const showCreds = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const auths = await DoctorAuth.find({}).populate('doctor');

        let output = '\n=== DOCTOR LOGIN CREDENTIALS ===\n';
        output += 'Default Password (set during migration): 12345\n';
        output += 'Note: If the doctor has changed their password, this default custom password will not work.\n';
        output += '===================================\n\n';

        if (auths.length === 0) {
            output += 'No doctor credentials found in DoctorAuth collection.\n';
        }

        auths.forEach(auth => {
            if (auth.doctor) {
                output += `Doctor Name: ${auth.doctor.name}\n`;
                output += `Login Email: ${auth.email}\n`;
                output += '-------------------\n';
            } else {
                output += `[Orphaned Auth Record]\n`;
                output += `Login Email: ${auth.email}\n`;
                output += '-------------------\n';
            }
        });

        fs.writeFileSync(path.join(__dirname, 'creds_output.txt'), output);
        console.log('Credentials written to creds_output.txt');

        process.exit();
    } catch (error) {
        console.error('Error fetching credentials:', error);
        process.exit(1);
    }
};

showCreds();
