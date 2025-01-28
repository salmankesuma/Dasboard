const mongoose = require('mongoose');

const schemaSiswa = new mongoose.Schema({
    name : {type : String, required : true},
    kelas: {type: String, required : true},
    tanggal_masuk: {type: Date, required : true},
    status: {type: String, required : true},
    tanggal_lahir: {type: Date, required : true},
    kelamin: {type: String, required : true, enum: ['L', 'P']},
    alamat : {type : String, required: true},
    nilai:[
        {
            mata_pelajaran :{
                type: String,
                required: true
            },
            score :{
                type: Number,
                required: true
            }
        }
    ],
    sekolah: {type: mongoose.Schema.Types.ObjectId, ref: 'Sekolah', required : true}
    
}, { timestamps: true });
module.exports = mongoose.model('Siswa', schemaSiswa);
