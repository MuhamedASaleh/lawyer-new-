const Admin = require('../../models/adminModel');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRATION } = require('../../config/jwtConfig');

// Create a new admin
const createAdmin = async (req, res) => {
    try {
        const { phoneNumber, password } = req.body;
        const admin = await Admin.create({ phoneNumber, password });
        res.status(201).json(admin);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all admins
const getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.findAll();
        res.status(200).json(admins);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get admin by ID
const getAdminById = async (req, res) => {
    try {
        const { id } = req.params;
        const admin = await Admin.findByPk(id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.status(200).json(admin);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update admin details
const updateAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { phoneNumber, password } = req.body;

        const admin = await Admin.findByPk(id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        admin.phoneNumber = phoneNumber;
        admin.password = password;
        await admin.save();

        res.status(200).json(admin);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete an admin
const deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const admin = await Admin.findByPk(id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        await admin.destroy();
        res.status(200).json({ message: 'Admin deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
async function registerAdmin(req, res) {
    const { phoneNumber, password } = req.body;

    try {
        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ where: { phoneNumber } });
        if (existingAdmin) {
            return res.status(400).json({ error: 'Admin already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new admin
        const newAdmin = await Admin.create({ phoneNumber, password: hashedPassword });

        res.status(201).json({ message: 'Admin registered successfully', admin: newAdmin });
    } catch (err) {
        console.error('Error registering admin:', err);
        res.status(500).json({ error: 'Error registering admin', details: err.message });
    }
}
async function loginAdmin(req, res) {
    const { phoneNumber, password } = req.body;

    try {
        // Find the admin by phoneNumber
        const admin = await Admin.findOne({ where: { phoneNumber } });
        if (!admin) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Check if the password matches
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign({ adminID: admin.adminID }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error logging in' });
    }
}


module.exports = {
    createAdmin,
    getAllAdmins,
    getAdminById,
    updateAdmin,
    deleteAdmin,
    registerAdmin,
    loginAdmin
};
