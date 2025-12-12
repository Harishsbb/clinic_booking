const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const Doctor = require('./models/Doctor');

dotenv.config({ path: path.join(__dirname, '.env') });

const doctors = [
    {
        name: 'Dr. K. Rajesh',
        specialty: 'General Medicine',
        bio: 'Senior consultant with extensive experience in general medicine and critical care.',
        fee: 500,
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        availability: ['Mon-Sat 10am-2pm'],
        docId: 1,
        hospital: 'Rajarajeswari Hospitals Pvt Ltd',
        district: 'Dindigul'
    },
    {
        name: 'Dr. S. Mahalakshmi',
        specialty: 'Psychiatry',
        bio: 'Specialist in treating mental health disorders with a compassionate approach.',
        fee: 600,
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        availability: ['Mon-Fri 4pm-8pm'],
        docId: 2,
        hospital: 'Ramana Hospital',
        district: 'Dindigul'
    },
    {
        name: 'Dr. M. Kumar',
        specialty: 'Cardiology',
        bio: 'Expert in interventional cardiology and heart failure management.',
        fee: 800,
        image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        availability: ['Tue-Sat 9am-1pm'],
        docId: 3,
        hospital: 'Vadamalayan Hospitals Pvt Ltd',
        district: 'Dindigul'
    },
    {
        name: 'Dr. R. Anitha',
        specialty: 'Gynecology',
        bio: 'Dedicated to women’s health and fertility treatments.',
        fee: 450,
        image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        availability: ['Mon-Sat 11am-3pm'],
        docId: 4,
        hospital: 'KAVIN FERTILITY & WOMEN’S CENTRE',
        district: 'Dindigul'
    },
    {
        name: 'Dr. P. Suresh',
        specialty: 'Pediatrics',
        bio: 'Friendly pediatrician specializing in child health and vaccination.',
        fee: 300,
        image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        availability: ['Mon-Sat 5pm-9pm'],
        docId: 5,
        hospital: 'Starkids Women & Children Hospital',
        district: 'Dindigul'
    },
    {
        name: 'Dr. T. Venkatesh',
        specialty: 'Orthopedics',
        bio: 'Specialist in joint replacement and trauma surgery.',
        fee: 600,
        image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        availability: ['Mon-Fri 10am-1pm'],
        docId: 6,
        hospital: 'KT HOSPITALS',
        district: 'Dindigul'
    },
    {
        name: 'Dr. A. Meera',
        specialty: 'Dermatology',
        bio: 'Expert in skin care, laser treatments, and cosmetic dermatology.',
        fee: 400,
        image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        availability: ['Tue-Sat 4pm-7pm'],
        docId: 7,
        hospital: 'Shree Sathya Subha Hospital[S3]',
        district: 'Dindigul'
    },
    {
        name: 'Dr. K. Ganesh',
        specialty: 'Neurology',
        bio: 'Consultant neurologist with expertise in stroke and epilepsy.',
        fee: 700,
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        availability: ['Mon-Fri 9am-12pm'],
        docId: 8,
        hospital: 'JCB Hospitals',
        district: 'Dindigul'
    }
];

const DoctorAuth = require('./models/DoctorAuth');

const seedDoctors = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Clear existing doctors and doctor auths
        await Doctor.deleteMany({});
        await DoctorAuth.deleteMany({});
        console.log('Existing doctors and auth records cleared');

        const createdDoctors = await Doctor.insertMany(doctors);
        console.log('Doctors Seeded Successfully');

        // Create Auth entries for each doctor
        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const doctorAuths = createdDoctors.map(doc => ({
            doctor: doc._id,
            email: doc.name.toLowerCase().replace(/dr\. /g, '').replace(/\./g, '').replace(/\s+/g, '') + '@clinic.com',
            password: hashedPassword
        }));

        await DoctorAuth.insertMany(doctorAuths);
        console.log('Doctor Auth Credentials Created');

        console.log('Credentials:');
        doctorAuths.forEach(auth => {
            console.log(`Email: ${auth.email}, Password: ${auth.password}`);
        });

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDoctors();
