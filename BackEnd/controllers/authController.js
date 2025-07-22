const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { User, DriverDetail, PasswordReset, Role } = require('../models');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '86400';
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

// Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
});

// Helper: Send OTP email
async function sendOtpEmail(email, otp) {
    await transporter.sendMail({
        from: EMAIL_USER,
        to: email,
        subject: 'Your Password Reset OTP',
        text: `Your OTP for password reset is: ${otp}`,
    });
}

// Register driver
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, userName, email, password, nicNo, licenseNo, licenseType, contactNo, bloodGroup, address } = req.body;
        // Check if user exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: 'Email already registered' });
        // Find driver role
        const driverRole = await Role.findOne({ where: { roleName: 'User' } });
        if (!driverRole) return res.status(500).json({ message: 'Driver role not found' });
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create user
        const user = await User.create({
            firstName, lastName, userName, email, password: hashedPassword, roleId: driverRole.id, isActive: true
        });
        // Create driver detail
        await DriverDetail.create({
            nicNo, licenseNo, licenseType, contactNo, bloodGroup, address, userId: User.id
        });
        res.status(201).json({ message: 'Driver registered successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Login driver
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
        // Only allow driver role
        const role = await Role.findByPk(user.roleId);
        if (!role || role.roleName !== 'User') return res.status(403).json({ message: 'Not a driver account' });
        const token = jwt.sign({ id: user.id, email: user.email, role: role.roleName }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.json({ token, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Forgot password (send OTP)
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ message: 'Email not found' });
        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000);
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min
        // Save OTP
        await PasswordReset.create({ userId: user.id, otp, expiresAt });
        // Send email
        await sendOtpEmail(email, otp);
        res.json({ message: 'OTP sent to email' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Reset password (verify OTP)
router.post('/reset-password', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ message: 'Email not found' });
        // Find OTP
        const reset = await PasswordReset.findOne({ where: { userId: user.id, otp }, order: [['createdAt', 'DESC']] });
        if (!reset || reset.expiresAt < new Date()) return res.status(400).json({ message: 'Invalid or expired OTP' });
        // Update password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        // Optionally, delete used OTP
        await reset.destroy();
        res.json({ message: 'Password reset successful' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
