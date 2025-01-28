const { default: mongoose } = require('mongoose');
const Siswa = require('../models/siswaModel');
const Guru = require('../models/guruModel')
const Sekolah = require('../models/sekolahModel');
const { ObjectId } = require('mongoose').Types;


class sekolahController{
    //membuat sekolah
    static async createSchool(req, res){
        try{
            const sekolah = new Sekolah(req.body);
            await sekolah.save();
            res.status(201).json({message : 'Sekolah Berhasil di tambahkan', sekolah});
        }catch (error){
            res.status(400).json({error : error.message});
        }
    }

    //get semua nama sekolah
    static async getAllSchoolName(req, res){
        try{
            const sekolah = await Sekolah.find({}, {name: 1, alamat: 1, _id: 1});
            res.status(200).json(sekolah);
        }catch (error){
            res.status(500).json({ error: error.message});
        }
    }

    //get semua detail sekolah
    static async getDetailSchool(req, res) {
        try {
            // Mengambil ID dari params
            const { id } = req.params;  // pastikan hanya mengambil ID dari params
            
            // Pastikan ID yang diterima adalah ObjectId yang valid
            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'ID tidak valid' });
            }
    
            // Mencari sekolah berdasarkan ID
            const detailSekolah = await Sekolah.findById(id);
            
            // Jika tidak ditemukan
            if (!detailSekolah) {
                return res.status(404).json({ message: 'Detail sekolah tidak ada' });
            }
    
            // Jika ditemukan, kirimkan detail sekolah
            res.status(200).json(detailSekolah);
        } catch (error) {
            // Jika ada error lainnya, kirimkan pesan error
            res.status(500).json({ error: error.message });
        }
    }
    

    //update sekolah
    static async updateSchool(req, res){
        try{
            const sekolah = await Sekolah.findByIdAndUpdate(req.params.id, req.body, {new: true});
            if(!sekolah) return res.status(404).json({message: 'Sekolah tidak ada'});
            res.status(200).json({message: 'Sekolah berhasil diperbarui', sekolah});
        }catch(error){
            res.status(400).json({error: error.message});
        }
    }

    //Delete sekolah
    static async deleteSchool(req, res){
        try {
            // Ambil id dari req.params
            const { id } = req.params;
            const hapusSekolah = await Sekolah.findByIdAndDelete(id);
            
            if (!hapusSekolah) {
                throw new Error('Sekolah tidak ditemukan');
            }    
            // Kirim response jika berhasil
            res.status(200).json({ message: 'Sekolah Berhasil dihapus' });
        } catch (error) {
            // Kirim error response
            res.status(400).json({ error: error.message });
        }
    }
    
    // Fungsi pencarian sekolah berdasarkan nama
    static async searchSchool(req, res) {
        try {
            const { query } = req.body; // Menerima query pencarian dari frontend
    
            // Pastikan query ada
            if (!query) {
                return res.status(400).json({ message: 'Query pencarian tidak ditemukan' });
            }
    
            // Mencari sekolah berdasarkan nama yang mengandung kata kunci pencarian
            const regex = new RegExp(query, 'i');  // Case-insensitive search
            const schools = await Sekolah.find({
                name: { $regex: regex }
            });
    
            // Kirimkan hasil pencarian
            res.status(200).json(schools); // Kirim semua data sekolah yang cocok
    
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
}

module.exports= sekolahController;