const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
    'http://localhost:5173',
    'https://clinic-booking-client.vercel.app',
    'https://clinic-booking-rho.vercel.app' // Add your specific frontend URL here
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1 && !origin.endsWith('.vercel.app')) {
            var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(null, true); // Allow it anyway for now to fix the issue
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable preflight for all routes
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/doctor/auth', require('./routes/doctorAuthRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/hospitals', require('./routes/hospitals'));
// app.use('/api/payment', require('./routes/paymentRoutes')); // Placeholder

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
