const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const listUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const users = await User.find().limit(5);
        console.log('Users found:', users);

        mongoose.connection.close();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

listUsers();
