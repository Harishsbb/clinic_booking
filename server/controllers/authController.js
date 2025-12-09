const User = require('../models/User');
// const bcrypt = require('bcryptjs'); // Simplified for now
// const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        user = new User({ name, email, password });
        await user.save();
        res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        if (user.password !== password) return res.status(400).json({ msg: 'Invalid Credentials' });

        res.json({ msg: 'Login successful', userId: user._id, role: user.role, name: user.name });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};
