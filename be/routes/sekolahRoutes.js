const express = require('express')
const sekolahController = require('../controllers/sekolahController')
const router = express.Router();

router.post('/', sekolahController.createSchool);
router.get('/', sekolahController.getAllSchoolName);
router.get('/:id', sekolahController.getDetailSchool);
router.put('/:id', sekolahController.updateSchool);
router.delete('/:id', sekolahController.deleteSchool);
router.post('/search', sekolahController.searchSchool);

module.exports = router;