//ini yang asli
const express = require('express');
const mongoose = require('mongoose');
const cors  = require('cors');
//routes
const sekolahRoutes = require('./routes/sekolahRoutes');
const siswaRoutes = require('./routes/siswaRoutes');
const guruRoutes = require('./routes/guruRoutes')
const adminRoutes = require('./routes/adminRoutes');

const server = express();
const port = 5000;

server.use(express.json());
server.use(cors());

//koneksi ke database
mongoose.connect('mongodb://localhost:27017/uas')
    .then(() => console.log('connect to database'))
    .catch(err => console.error('tidak bisa konek ke database', err)
)


//Routes
server.use('/sekolah', sekolahRoutes);
server.use('/siswa', siswaRoutes);
server.use('/guru', guruRoutes);
server.use('/admin', adminRoutes);

server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});

