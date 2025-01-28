const { default: mongoose } = require('mongoose');
const Siswa = require('../models/siswaModel');
const Sekolah = require('../models/sekolahModel');
const { ObjectId } = require('mongoose').Types;

class siswaController {
    // Membuat siswa baru
    static async createSiswa(req, res) {
        try {
            const siswa = new Siswa(req.body);
            await siswa.save();
            res.status(201).json({ message: 'Siswa berhasil ditambahkan', siswa });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    // Mendapatkan detail siswa berdasarkan ID
    static async getDetailSiswa(req, res) {
        try {
            const { id } = req.params;

            // Validasi ID
            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'ID tidak valid' });
            }

            const siswa = await Siswa.findById(id).populate('sekolah', 'name alamat');
            if (!siswa) {
                return res.status(404).json({ message: 'Siswa tidak ditemukan' });
            }

            res.status(200).json(siswa);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Mengupdate data siswa berdasarkan ID
    static async updateSiswa(req, res) {
        try {
            const siswa = await Siswa.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!siswa) {
                return res.status(404).json({ message: 'Siswa tidak ditemukan' });
            }
            res.status(200).json({ message: 'Siswa berhasil diperbarui', siswa });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    // Menghapus siswa berdasarkan ID
    static async deleteSiswa(req, res) {
        try {
            const { id } = req.params;

            // Validasi ID
            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'ID tidak valid' });
            }

            const siswa = await Siswa.findByIdAndDelete(id);
            if (!siswa) {
                return res.status(404).json({ message: 'Siswa tidak ditemukan' });
            }

            res.status(200).json({ message: 'Siswa berhasil dihapus' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    //Mendapatkan semua siswa berdasarkan ID Sekolah
    static async getSiswaBySekolah(req, res) {
        try {
            const { sekolahId } = req.params;

            // Validasi ID Sekolah
            if (!ObjectId.isValid(sekolahId)) {
                return res.status(400).json({ message: 'ID Sekolah tidak valid' });
            }

            const siswa = await Siswa.find({ sekolah: sekolahId }).populate('sekolah', 'name alamat');
            if (siswa.length === 0) {
                return res.status(404).json({ message: 'Tidak ada siswa di sekolah ini' });
            }

            res.status(200).json(siswa);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

   // Fungsi untuk menghitung jumlah siswa berdasarkan ID sekolah
static async getSiswaCountBySekolah(req, res) {
    try {
        // Ambil ID sekolah dari parameter URL
        const { sekolahId } = req.params;

        // Validasi apakah ID valid
        if (!mongoose.Types.ObjectId.isValid(sekolahId)) {
            return res.status(400).json({ message: 'ID Sekolah tidak valid' });
        }

        // Agregasi untuk menghitung jumlah siswa berdasarkan sekolahId
        const result = await Siswa.aggregate([
            {
                $match: { sekolah: new mongoose.Types.ObjectId(sekolahId) }, // Perbaikan: Gunakan `new` untuk ObjectId
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
            return res.status(404).json({ message: 'Tidak ada siswa ditemukan untuk sekolah ini' });
        }

        // Kirim respons dengan hasil jumlah siswa
        res.status(200).json({ count: result[0].count });

    } catch (error) {
        console.error(error); // Log error untuk debugging
        res.status(500).json({ error: error.message });
    }
}



// Fungsi untuk mendapatkan semua sekolah dan siswa berdasarkan schoolId
static async getSekolahDenganSiswa(req, res) {
    try {
        const { sekolahId } = req.params;

        // Validasi ID Sekolah
        if (!ObjectId.isValid(sekolahId)) {
            return res.status(400).json({ message: 'ID Sekolah tidak valid' });
        }

        const siswa = await Siswa.aggregate([
            {
                $match: { sekolah: new ObjectId(sekolahId) } // Filter siswa berdasarkan ID sekolah
            },
            {
                $lookup: {
                    from: 'sekolahs', // Nama koleksi untuk data sekolah
                    localField: 'sekolah', // Field yang ada di koleksi siswa
                    foreignField: '_id', // Field yang ada di koleksi sekolah
                    as: 'sekolah' // Nama alias untuk data sekolah
                }
            },
            {
                $unwind: '$sekolah' // Mengeluarkan array 'sekolah' menjadi objek
            }
        ]);

        if (siswa.length === 0) {
            return res.status(404).json({ message: 'Tidak ada siswa di sekolah ini' });
        }

        res.status(200).json(siswa);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

    //nilai rata-rata
    static async  nilaiRataRata(req, res){

        try {
            const {schoolId} = req.params;
            if (!ObjectId.isValid(schoolId)) {
                return res.status(400).json({ message: 'ID Sekolah tidak valid' });
            }
            const nilai = await  Siswa.aggregate([
                {
                    // Filter data berdasarkan id sekolah
                    $match: {
                        sekolah: new ObjectId(schoolId) // Ganti dengan id sekolah yang diinginkan
                    }
                },
                {
                    // Unwind array nilai untuk memproses setiap nilai secara individu
                    $unwind: "$nilai"
                },
                {
                    // Mengelompokkan data berdasarkan kelas
                    $group: {
                        _id: "$kelas", // Grup berdasarkan kelas
                        totalNilai: { $sum: "$nilai.score" }, // Jumlah total skor
                        jumlahNilai: { $sum: 1 } // Hitung jumlah nilai
                    }
                },
                {
                    // Hitung rata-rata nilai per kelas
                    $project: {
                        _id: 0,
                        kelas: "$_id", // Kelas
                        rataRataKelas: { $divide: ["$totalNilai", "$jumlahNilai"] } // Rata-rata = total / jumlah
                    }
                },
                {
                    // Urutkan berdasarkan kelas secara ascending
                    $sort: {
                        kelas: 1
                    }
                }
            ]);          
            res.status(200).json(nilai);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = siswaController;
