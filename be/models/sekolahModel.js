const mongoose = require('mongoose');

const schemaSekolah = new mongoose.Schema({
    name : {type : String, required: true},
    alamat : {type : String, required: true},
    tahun : {type : Number, required: true},
    dana_bos : [
                {
                    tahun : {type : Number, required : true},
                    jumlah : {type : Number, required : true},
                }
            ],
    dana_anggaran : [
             {
                tahun : {type : Number, required : true},
                jumlah : {type : Number, required : true},
            }
    ]
});
module.exports = mongoose.model('Sekolah', schemaSekolah);
