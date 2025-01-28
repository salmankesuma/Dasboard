const express = require('express');
const guruController = require('../controllers/guruController');
const router = express.Router();

// Membuat guru baru
router.post('/', guruController.createGuru);

// Mendapatkan detail guru berdasarkan ID
router.get('/:id', guruController.getDetailGuru);

// Mengupdate data guru berdasarkan ID
router.put('/:id', guruController.updateGuru);

// Menghapus guru berdasarkan ID
router.delete('/:id', guruController.deleteGuru);

// Mendapatkan semua guru berdasarkan ID Sekolah
router.get('/sekolah/:sekolahId', guruController.getGuruBySekolah);

router.get('/sekolah/count/:sekolahId', guruController.getGuruCountBySekolah);


module.exports = router;
