const express = require('express')
const siswaController = require('../controllers/siswaController')
const router = express.Router();

router.post('/', siswaController.createSiswa);
router.get('/:id', siswaController.getDetailSiswa);
router.put('/:id', siswaController.updateSiswa);
router.delete('/:id', siswaController.deleteSiswa);
router.get('/sekolah/:sekolahId', siswaController.getSiswaBySekolah);
router.get('/sekolah/count/:sekolahId', siswaController.getSiswaCountBySekolah);
router.get('/sekolah/detail/:sekolahId', siswaController.getSekolahDenganSiswa);
router.get('/nilai/:schoolId', siswaController.nilaiRataRata);
module.exports = router;