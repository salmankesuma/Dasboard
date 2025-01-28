const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');

class adminController {

    static async register(req, res) {
        try {
            const { username, password, email } = req.body;

            const hashedPassword = await bcrypt.hash(password, 10);
            const admin = new Admin({ username, password: hashedPassword, email });

            await admin.save();
            res.status(201).json({ message: 'Berhasil Mendaftar' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async loginAdmin(req, res) {
        try {
            const { username, password } = req.body;

            const user = await Admin.findOne({ username });
            if (!user) {
                return res.status(404).json({ message: "Pengguna tidak ditemukan" });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Password Salah." });
            }

            const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ message: "Login berhasil!", token });

        } catch (error) {
            res.status(500).json({ message: "Terjadi kesalahan server.", error });
        }
    }
}

module.exports = adminController;