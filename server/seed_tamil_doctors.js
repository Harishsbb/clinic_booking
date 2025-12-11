const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Doctor = require('./models/Doctor');
const DoctorAuth = require('./models/DoctorAuth');

dotenv.config();

const tamilDoctors = [
    { name: "Dr. S. Karthik", gender: "men" },
    { name: "Dr. M. Lakshmi", gender: "women" },
    { name: "Dr. R. Vijay", gender: "men" },
    { name: "Dr. K. Meena", gender: "women" },
    { name: "Dr. P. Ganesh", gender: "men" },
    { name: "Dr. A. Anitha", gender: "women" },
    { name: "Dr. T. Suresh", gender: "men" },
    { name: "Dr. V. Deepa", gender: "women" },
    { name: "Dr. G. Ramesh", gender: "men" },
    { name: "Dr. S. Priya", gender: "women" },
    { name: "Dr. J. Arun", gender: "men" },
    { name: "Dr. B. Divya", gender: "women" },
    { name: "Dr. N. Rajesh", gender: "men" },
    { name: "Dr. K. Kavitha", gender: "women" },
    { name: "Dr. M. Balaji", gender: "men" },
    { name: "Dr. R. Revathi", gender: "women" },
    { name: "Dr. S. Saravanan", gender: "men" },
    { name: "Dr. P. Geetha", gender: "women" },
    { name: "Dr. T. Murugan", gender: "men" },
    { name: "Dr. V. Sangeetha", gender: "women" },
    { name: "Dr. G. Manikandan", gender: "men" },
    { name: "Dr. A. Malar", gender: "women" },
    { name: "Dr. K. Senthil", gender: "men" },
    { name: "Dr. M. Vidhya", gender: "women" },
    { name: "Dr. R. Dinesh", gender: "men" },
    { name: "Dr. S. Gayathri", gender: "women" },
    { name: "Dr. J. Vignesh", gender: "men" },
    { name: "Dr. B. Hemalatha", gender: "women" },
    { name: "Dr. N. Pradeep", gender: "men" },
    { name: "Dr. K. Indhu", gender: "women" }
];

const specialties = [
    "Cardiology", "Neurology", "Orthopedics", "Pediatrics",
    "Dermatology", "General Medicine", "Gynecology", "ENT", "Psychiatry"
];

const hospitals = [
    "Apollo Hospital", "Kauvery Hospital", "Meenakshi Mission",
    "Government Hospital", "Vadamalayan Hospitals", "Sims Hospital",
    "Chettinad Health City", "Ganga Hospital"
];

const districts = [
    "Madurai", "Chennai", "Coimbatore", "Trichy", "Salem", "Tirunelveli", "Thanjavur"
];

const seedDoctors = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connected to MongoDB...');

        // Clear existing doctors and auths to start fresh with HD images
        console.log('Clearing existing doctor data...');
        await Doctor.deleteMany({});
        await DoctorAuth.deleteMany({});

        // Find the highest docId to start incrementing (will be 1 since we cleared)
        let nextDocId = 1;

        for (let i = 0; i < tamilDoctors.length; i++) {
            const docInfo = tamilDoctors[i];
            const specialty = specialties[Math.floor(Math.random() * specialties.length)];
            const hospital = hospitals[Math.floor(Math.random() * hospitals.length)];
            const district = districts[Math.floor(Math.random() * districts.length)];

            // Use local custom images
            // We have 4 images: doc1.png (Male), doc2.png (Female), doc3.png (Male), doc4.png (Female)
            let imagePath;
            if (docInfo.gender === 'men') {
                // Randomly pick doc1 or doc3
                const pick = Math.random() > 0.5 ? 1 : 3;
                imagePath = `/doctors/doc${pick}.png`;
            } else {
                // Randomly pick doc2 or doc4
                const pick = Math.random() > 0.5 ? 2 : 4;
                imagePath = `/doctors/doc${pick}.png`;
            }

            // Note: In production, these are served from the public folder
            const image = imagePath;

            // Generate email
            const nameParts = docInfo.name.replace('Dr.', '').replace(/\./g, '').trim().split(' ');
            const simpleName = nameParts[nameParts.length - 1].toLowerCase();
            // Add random number to email to ensure uniqueness
            const email = `${simpleName}${Math.floor(Math.random() * 1000)}@clinic.com`;

            const newDoctor = new Doctor({
                name: docInfo.name,
                specialty: specialty,
                bio: `Experienced ${specialty} specialist with over ${Math.floor(Math.random() * 15) + 5} years of practice. Dedicated to patient care at ${hospital}.`,
                fee: Math.floor(Math.random() * 500) + 300, // Random fee between 300 and 800
                image: image,
                availability: ["Mon-Fri 9am-5pm", "Sat 10am-1pm"],
                docId: nextDocId++,
                hospital: hospital,
                district: district,
                email: email
            });

            const savedDoctor = await newDoctor.save();

            // Create Auth
            const newAuth = new DoctorAuth({
                doctor: savedDoctor._id,
                email: email,
                password: '12345'
            });
            await newAuth.save();

            console.log(`Added: ${docInfo.name} (${email})`);
        }

        console.log('--- SEEDING COMPLETED ---');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedDoctors();
