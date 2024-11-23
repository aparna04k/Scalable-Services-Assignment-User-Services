// const User = require('../models/user');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');

// exports.register = async (req, res) => {
//     try {
//         const { username, email, password } = req.body;
//         const user = await User.create({ username, email, password });
//         res.json(user);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

// exports.login = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await User.findOne({ where: { email } });
//         if (!user || !await bcrypt.compare(password, user.password)) {
//             return res.status(401).json({ error: 'Invalid credentials' });
//         }
//         const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//         res.json({ token });
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

// exports.getProfile = async (req, res) => {
//     try {
//         const user = await User.findByPk(req.user.id);
//         res.json(user);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };


const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database'); // Correct import

exports.register = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { username, email, password } = req.body;
        const user = await User.create({ username, email, password }, { transaction });

        // Commit the transaction if all is good
        await transaction.commit();
        res.json(user);
    } catch (error) {
        // Rollback the transaction in case of an error
        await transaction.rollback();
        res.status(400).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
