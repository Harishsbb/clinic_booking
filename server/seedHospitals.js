const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const Hospital = require('./models/Hospital');

dotenv.config({ path: path.join(__dirname, '.env') });

const hospitals = [
    {
        name: "Rajarajeswari Hospitals Pvt Ltd",
        rating: "4.9",
        reviews: "1.6K",
        type: "Hospital",
        address: "46, Thiruvalluvar Salai",
        phone: "098421 88880",
        hours: "Open 24 hours"
    },
    {
        name: "Ramana Hospital",
        rating: "4.9",
        reviews: "1.1K",
        type: "Psychiatric hospital",
        address: "27, Sub Collector Office Rd",
        phone: "095439 37590",
        hours: "Open · Closes 9:30 pm"
    },
    {
        name: "Vadamalayan Hospitals Pvt Ltd",
        rating: "4.7",
        reviews: "1.3K",
        type: "Hospital",
        address: "649/ A2, Chettinaikanpatti village Road",
        phone: "0451 356 1000",
        hours: "Open 24 hours"
    },
    {
        name: "KT HOSPITALS",
        rating: "4.7",
        reviews: "1.1K",
        type: "Hospital",
        address: "222, Near, Palani Rd",
        phone: "088077 22202",
        hours: "Open 24 hours"
    },
    {
        name: "JCB Hospitals",
        rating: "4.7",
        reviews: "1.2K",
        type: "General hospital",
        address: "No.1, VEEPPAANTHOPPU STREET, Palani Rd",
        phone: "0451 243 3993",
        hours: "Open 24 hours"
    },
    {
        name: "Shree Sathya Subha Hospital[S3]",
        rating: "4.5",
        reviews: "430",
        type: "Hospital",
        address: "No: 53, Dindigul - Palani Rd",
        phone: "074027 40451",
        hours: "Open 24 hours"
    },
    {
        name: "KAVIN FERTILITY & WOMEN’S CENTRE",
        rating: "5.0",
        reviews: "848",
        type: "Hospital",
        address: "95-B1, Thiruvalluvar Salai",
        phone: "099940 10509",
        hours: "Open 24 hours"
    },
    {
        name: "Srii Amogam Hospital",
        rating: "4.7",
        reviews: "167",
        type: "Hospital",
        address: "C-12, H1, RM Colony Main Rd",
        phone: "096269 56666",
        hours: "Open 24 hours"
    },
    {
        name: "Dharshini Hospitals",
        rating: "4.5",
        reviews: "307",
        type: "General hospital",
        address: "Narayana Nagar, 34, Naicker New 1st St",
        phone: "098421 13392",
        hours: "Open 24 hours"
    },
    {
        name: "Kanna Hospital",
        rating: "4.5",
        reviews: "823",
        type: "Hospital",
        address: "13-D, Aarthi Theatre Rd",
        phone: "0451 243 0088",
        hours: "Open 24 hours"
    },
    {
        name: "Bathra hospital , Thulasi Lab",
        rating: "5.0",
        reviews: "294",
        type: "Hospital",
        address: "Roja, 3/587, Arivuthirukoil Road",
        phone: "089036 89707",
        hours: "Closed · Opens 7:15 am Wed"
    },
    {
        name: "CIPACA - Raja Rajeswari Hospital",
        rating: "4.9",
        reviews: "74",
        type: "Hospital",
        address: "46, Thiruvalluvar Salai",
        phone: "082382 38233",
        hours: "Open 24 hours"
    },
    {
        name: "Shifa Multi Speciality Hospital",
        rating: "4.6",
        reviews: "261",
        type: "Hospital",
        address: "Dindigul, Tamil Nadu",
        phone: "083000 03456",
        hours: "Open 24 hours"
    },
    {
        name: "United welfare Hospital",
        rating: "4.9",
        reviews: "130",
        type: "Hospital",
        address: "Dindigul - Vellodu - Madurai Rd",
        phone: "097915 29455",
        hours: "Open 24 hours"
    },
    {
        name: "Bharathi Mission Hospital",
        rating: "4.7",
        reviews: "265",
        type: "Hospital",
        address: "11, 91, NVGB Hall Rd",
        phone: "063816 88494",
        hours: "Open 24 hours"
    },
    {
        name: "Starkids Women & Children Hospital",
        rating: "4.9",
        reviews: "605",
        type: "Children's hospital",
        address: "1, 2, Trichy - Dindugal Rd",
        phone: "090921 92100",
        hours: "Open 24 hours"
    },
    {
        name: "Das Hospital",
        rating: "4.8",
        reviews: "33",
        type: "Hospital",
        address: "9X7P+2JM, Round Rd",
        phone: "",
        hours: "Open"
    },
    {
        name: "Vignesh Hospital",
        rating: "4.7",
        reviews: "132",
        type: "Hospital",
        address: "22, Palani Rd",
        phone: "097506 33415",
        hours: "Open 24 hours"
    },
    {
        name: "JJ ARUL HOSPITAL",
        rating: "4.3",
        reviews: "125",
        type: "Hospital",
        address: "A2, 2/1, Begampur, NH Po",
        phone: "07397 769 494",
        hours: "Open 24 hours"
    },
    {
        name: "Nirvin heart and Lung hospital",
        rating: "4.9",
        reviews: "87",
        type: "Hospital",
        address: "1, Thadicombu Rd",
        phone: "080 4482 7389",
        hours: "Open 24 hours"
    }
];

const seedHospitals = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Clear existing hospitals
        await Hospital.deleteMany({});
        console.log('Existing hospitals cleared');

        await Hospital.insertMany(hospitals);
        console.log('Hospitals Seeded Successfully');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedHospitals();
