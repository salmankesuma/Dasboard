const { default: mongoose } = require('mongoose');
const Guru = require('../models/guruModel');
const Sekolah = require('../models/sekolahModel');
const { ObjectId } = require('mongoose').Types;

class guruController {
    // Membuat guru baru
    static async createGuru(req, res) {
        try {
            const guru = new Guru(req.body);
            await guru.save();
            res.status(201).json({ message: 'Guru berhasil ditambahkan', guru });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    // Mendapatkan detail guru berdasarkan ID
    static async getDetailGuru(req, res) {
        try {
            const { id } = req.params;

            // Validasi ID
            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'ID tidak valid' });
            }

            const guru = await Guru.findById(id).populate('sekolah', 'name alamat');
            if (!guru) {
                return res.status(404).json({ message: 'Guru tidak ditemukan' });
            }

            res.status(200).json(guru);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Mengupdate data guru berdasarkan ID
    static async updateGuru(req, res) {
        try {
            const guru = await Guru.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!guru) {
                return res.status(404).json({ message: 'Guru tidak ditemukan' });
            }
            res.status(200).json({ message: 'Guru berhasil diperbarui', guru });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    // Menghapus guru berdasarkan ID
    static async deleteGuru(req, res) {
        try {
            const { id } = req.params;

            // Validasi ID
            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'ID tidak valid' });
            }

            const guru = await Guru.findByIdAndDelete(id);
            if (!guru) {
                return res.status(404).json({ message: 'Guru tidak ditemukan' });
            }

            res.status(200).json({ message: 'Guru berhasil dihapus' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    // Mendapatkan semua guru berdasarkan ID Sekolah
    static async getGuruBySekolah(req, res) {
        try {
            const { sekolahId } = req.params;

            // Validasi ID Sekolah
            if (!ObjectId.isValid(sekolahId)) {
                return res.status(400).json({ message: 'ID Sekolah tidak valid' });
            }

            const guru = await Guru.find({ sekolah: sekolahId }).populate('sekolah', 'name alamat');
            if (guru.length === 0) {
                return res.status(404).json({ message: 'Tidak ada guru di sekolah ini' });
            }

            res.status(200).json(guru);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getGuruCountBySekolah(req, res) {
        try {
            const { sekolahId } = req.params; // Ambil ID sekolah dari parameter URL

            // Validasi apakah ID valid
            if (!mongoose.Types.ObjectId.isValid(sekolahId)) {
                return res.status(400).json({ message: 'ID Sekolah tidak valid' });
            }
    
            // Agregasi untuk menghitung jumlah siswa berdasarkan sekolahId
            const result = await Guru.aggregate([
                {
                    $match: { sekolah: new mongoose.Types.ObjectId(sekolahId) }, // Filter berdasarkan sekolah._id
                },
                {
                    $group: {
                        _id: '$sekolah', // Kelompokkan berdasarkan sekolah
                        count: { $sum: 1 }, // Hitung jumlah dokumen
                    },
                },
            ]);
    
            // Jika tidak ada siswa, kirim pesan 404
            if (result.length === 0) {
                return 0;
            }
    
            // Kirim respons dengan hasil jumlah siswa
            res.status(200).json({  count: result[0].count });
        } catch (error) {
            console.error(error); // Log error untuk debugging
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = guruController;
