const endpointSekolah = 'http://localhost:5000/sekolah';
const dropdownMenu = document.getElementById('dropdownMenu');
const searchInput = document.getElementById('searchInput');
const loading = document.getElementById('loading');
const chartLoading = document.getElementById('chartLoading');
const lineChart = document.getElementById('lineChart').getContext('2d');
const jumlahSiswaElement = document.getElementById('jumlahSiswa'); // Elemen untuk menampilkan jumlah siswa
const jumlahGuruElement = document.getElementById('jumlahGuru');   // Elemen untuk menampilkan jumlah guru
const selectedSchoolNameElement = document.getElementById('selectedSchoolName'); // Elemen untuk nama sekolah
let chartInstance;

// Fungsi untuk mencari sekolah
async function searchSchools() {
    const query = document.getElementById("searchInput").value;

    if (!query) {
        document.getElementById("searchResult").innerHTML = '';
        return;
    }

    const url = 'http://localhost:5000/sekolah/search'; // Ganti dengan URL API Anda
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query })
        });

        const data = await response.json();
        const resultDiv = document.getElementById("searchResult");
        resultDiv.innerHTML = '';

        if (response.ok && data.length > 0) {
            data.forEach(school => {
                const resultItem = document.createElement("div");
                resultItem.classList.add("result-item");
                resultItem.textContent = school.name;
                // Simpan _id di atribut data-id
                resultItem.setAttribute("data-id", school._id);

                resultItem.onclick = function () {
                    document.getElementById("searchInput").value = school.name;
                    document.getElementById("selectedSchoolId").value = school._id; // Simpan _id di input hidden
                    console.log("ID Sekolah disimpan:", school._id);
                    const schoolId = document.getElementById("selectedSchoolId").value;
                    resultDiv.innerHTML = ''; // Kosongkan hasil pencarian setelah dipilih
                    loadChart(schoolId);
                    loadJumlahSiswa(schoolId);
                    loadJumlahGuru(schoolId);
                };

                resultDiv.appendChild(resultItem);
                
            });
        } else {
            resultDiv.innerHTML = "<p>Sekolah tidak ditemukan.</p>";
        }
    } catch (error) {
        console.error("Terjadi kesalahan saat mengambil data:", error);
        document.getElementById("searchResult").innerHTML = "<p>Terjadi kesalahan saat memuat data.</p>";
    }
}

// Fungsi untuk mendapatkan ID sekolah yang dipilih
function getSelectedSchoolId() {
    const schoolId = document.getElementById("selectedSchoolId").value;
    if (!schoolId) {
        console.error("ID Sekolah belum dipilih!");
        alert("Silakan pilih sekolah terlebih dahulu!");
        return;
    }
    console.log("ID Sekolah yang dipilih:", schoolId);
    alert("ID Sekolah yang dipilih: " + schoolId);
}

// Load chart data for a selected school
async function loadChart(schoolId) {
    const endpointSchoolData = `http://localhost:5000/sekolah/${schoolId}`;
    try {
        chartLoading.style.display = 'block';
        const response = await fetch(endpointSchoolData);
        if (!response.ok) throw new Error('Gagal mengambil data grafik');
        const schoolData = await response.json();

        // Render grafik dana
        renderChart(schoolData);

        chartLoading.style.display = 'none';
    } catch (error) {
        chartLoading.textContent = 'Gagal memuat data grafik.';
        selectedSchoolNameElement.textContent = ''; // Reset jika terjadi error
        console.error(error);
    }
}




// Render chart
function renderChart(data) {
    const labels = data.dana_bos.map(item => item.tahun);
    const danaBos = data.dana_bos.map(item => item.jumlah);
    const danaAnggaran = data.dana_anggaran.map(item => item.jumlah);

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(lineChart, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Dana BOS',
                    data: danaBos,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 2,
                },
                {
                    label: 'Dana Anggaran',
                    data: danaAnggaran,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderWidth: 2,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
            },
            scales: {
                x: { title: { display: true, text: 'Tahun' } },
                y: { title: { display: true, text: 'Jumlah Dana (IDR)' } },
            },
        },
    });
}

// Fetch and display jumlah siswa for a selected school
async function loadJumlahSiswa(schoolId) {  
    const endpointSiswa = ` http://localhost:5000/siswa/sekolah/count/${schoolId}`;
    try {
        const response = await fetch(endpointSiswa);
        if (!response.ok) throw new Error('Gagal mengambil data siswa');
        const siswaData = await response.json();
        const jumlahSiswa = siswaData.count || 0;
        jumlahSiswaElement.textContent = jumlahSiswa;
    } catch (error) {
        jumlahSiswaElement.textContent = '0';
        console.error(error);
    }
}

// Fetch and display jumlah guru for a selected school
async function loadJumlahGuru(schoolId) {
    const endpointGuru = ` http://localhost:5000/guru/sekolah/count/${schoolId}`;
    try {
        const response = await fetch(endpointGuru);
        if (!response.ok) throw new Error('Gagal mengambil data guru');
        const guruData = await response.json();
        const jumlahGuru = guruData.count;
        jumlahGuruElement.textContent = jumlahGuru;
    } catch (error) {
        jumlahGuruElement.textContent = '0';
        console.error(error);
    }
}

// Initialize
fetchSchools();

 // Fetch and display school list in table and dropdown
 async function fetchSchools() {
    try {
        const response = await fetch(`http://localhost:5000/sekolah`);
        if (!response.ok) throw new Error('Gagal mengambil data sekolah');
        const schools = await response.json();
        renderSchoolTable(schools);
        renderDropdown(schools);
        loading.style.display = 'none';
    } catch (error) {
        loading.textContent = 'Gagal memuat data sekolah.';
        console.error(error);
    }
}

// Render school table
function renderSchoolTable(schools) {
    schoolTableBody.innerHTML = '';
    schools.forEach((school, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${school.name}</td>
            <td>${school.alamat}</td>
            <td>
                <button class="btn btn-info btn-sm me-2" onclick="viewDetails('${school._id}')">Detail</button>
                <button class="btn btn-warning btn-sm me-2" onclick="updateSchool('${school._id}')">Update</button>
                <button class="btn btn-danger btn-sm" onclick="deleteSchool('${school._id}')">Hapus</button>
            </td>
        `;
        schoolTableBody.appendChild(row);
    });
}
// Fungsi untuk menampilkan detail sekolah
async function viewDetails(schoolId) {
    const endpointDetail = `http://localhost:5000/sekolah/${schoolId}`;
    try {
        // Fetch data sekolah berdasarkan ID
        const response = await fetch(endpointDetail);
        if (!response.ok) throw new Error('Gagal mengambil data detail sekolah');
        const school = await response.json();

        // Render detail di modal atau elemen lain
        renderSchoolDetails(school);
    } catch (error) {
        console.error('Error saat memuat detail sekolah:', error);
    }
}

// Fungsi untuk merender detail sekolah di modal
function renderSchoolDetails(school) {
    // Jika menggunakan modal Bootstrap
    const modalContent = `
        <div class="modal fade" id="detailModal" tabindex="-1" aria-labelledby="detailModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="detailModalLabel">Detail Sekolah</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p><strong>Nama Sekolah:</strong> ${school.name}</p>
                        <p><strong>Alamat:</strong> ${school.alamat}</p>
                        <p><strong>ID Sekolah:</strong> ${school._id}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Tambahkan modal ke body dan tampilkan
    document.body.insertAdjacentHTML('beforeend', modalContent);
    const modalInstance = new bootstrap.Modal(document.getElementById('detailModal'));
    modalInstance.show();

    // Hapus modal dari DOM setelah ditutup
    document.getElementById('detailModal').addEventListener('hidden.bs.modal', () => {
        document.getElementById('detailModal').remove();
    });
}
// Fungsi untuk memuat data sekolah dan membuka modal untuk update
async function updateSchool(schoolId) {
    const endpointDetail = `http://localhost:5000/sekolah/${schoolId}`;
    try {
        // Fetch data sekolah berdasarkan ID
        const response = await fetch(endpointDetail);
        if (!response.ok) throw new Error('Gagal mengambil data sekolah');
        const school = await response.json();

        // Render data sekolah di modal update
        renderUpdateModal(school);
    } catch (error) {
        console.error('Error saat memuat data untuk update:', error);
    }
}

// Fungsi untuk merender modal update
function renderUpdateModal(school) {
    const danaBosRows = school.dana_bos
        .map((item, index) => `
            <div class="row mb-3 dana-bos-row">
                <div class="col-md-6">
                    <input type="number" class="form-control bos-tahun" value="${item.tahun}" placeholder="Tahun">
                </div>
                <div class="col-md-6">
                    <input type="number" class="form-control bos-jumlah" value="${item.jumlah}" placeholder="Jumlah Dana BOS">
                </div>
            </div>
        `)
        .join('');

    const danaAnggaranRows = school.dana_anggaran
        .map((item, index) => `
            <div class="row mb-3 dana-anggaran-row">
                <div class="col-md-6">
                    <input type="number" class="form-control anggaran-tahun" value="${item.tahun}" placeholder="Tahun">
                </div>
                <div class="col-md-6">
                    <input type="number" class="form-control anggaran-jumlah" value="${item.jumlah}" placeholder="Jumlah Dana Anggaran">
                </div>
            </div>
        `)
        .join('');

    const modalContent = `
        <div class="modal fade" id="updateModal" tabindex="-1" aria-labelledby="updateModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="updateModalLabel">Update Data Sekolah</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="updateForm">
                            <div class="mb-3">
                                <label for="schoolName" class="form-label">Nama Sekolah</label>
                                <input type="text" class="form-control" id="schoolNameBaru" value="${school.name}" required>
                            </div>
                            <div class="mb-3">
                                <label for="schoolAddress" class="form-label">Alamat</label>
                                <input type="text" class="form-control" id="schoolAddressBaru" value="${school.alamat}" required>
                            </div>
                            <div class="mb-3">
                                <label for="schoolYear" class="form-label">Tahun Berdiri</label>
                                <input type="number" class="form-control" id="schoolYear" value="${school.tahun}" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Dana BOS</label>
                                <div id="danaBosContainer">
                                    ${danaBosRows}
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Dana Anggaran</label>
                                <div id="danaAnggaranContainer">
                                    ${danaAnggaranRows}
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                        <button type="button" class="btn btn-primary" onclick="submitUpdate('${school._id}')">Simpan Perubahan</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalContent);
    const modalInstance = new bootstrap.Modal(document.getElementById('updateModal'));
    modalInstance.show();

    document.getElementById('updateModal').addEventListener('hidden.bs.modal', () => {
        document.getElementById('updateModal').remove();
    });
}

async function submitUpdate(schoolId) {
    // const updatedName = document.getElementById('schoolNameBaru');
    // const updatedAddress = document.getElementById('schoolAddressBaru');
    const updateName = document.querySelector('#schoolNameBaru').value;
    const updateAddress = document.querySelector('#schoolAddressBaru').value;
    const updatedYear = parseInt(document.getElementById('schoolYear').value.trim(), 10);

    const danaBos = Array.from(document.querySelectorAll('.dana-bos-row')).map(row => ({
        tahun: parseInt(row.querySelector('.bos-tahun').value.trim(), 10),
        jumlah: parseInt(row.querySelector('.bos-jumlah').value.trim(), 10),
    }));

    const danaAnggaran = Array.from(document.querySelectorAll('.dana-anggaran-row')).map(row => ({
        tahun: parseInt(row.querySelector('.anggaran-tahun').value.trim(), 10),
        jumlah: parseInt(row.querySelector('.anggaran-jumlah').value.trim(), 10),
    }));

    const updatedData = {
        name: updateName,
        alamat: updateAddress,
        tahun: updatedYear,
        dana_bos: danaBos,
        dana_anggaran: danaAnggaran,
    };

    console.log(updatedData); // Debug data yang dikirim

    try {
        const endpointUpdate = `http://localhost:5000/sekolah/${schoolId}`;
        const response = await fetch(endpointUpdate, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData),
        });

        if (!response.ok) throw new Error('Gagal memperbarui data sekolah');
        alert('Data berhasil diperbarui!');
        bootstrap.Modal.getInstance(document.getElementById('updateModal')).hide();
        fetchSchools(); // Fungsi untuk memuat ulang tabel sekolah
    } catch (error) {
        console.error('Error saat memperbarui data sekolah:', error);
        alert('Terjadi kesalahan saat memperbarui data.');
    }
}


//menghapus school
async function deleteSchool(schoolId) {
    try {
        const endpointDelete = `http://localhost:5000/sekolah/${schoolId}`;
        const response = await fetch(endpointDelete, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Gagal menghapus data sekolah');
        }

        alert('Data berhasil dihapus!');
        fetchSchools(); // Fungsi untuk memuat ulang tabel sekolah
    } catch (error) {
        console.error('Error saat menghapus data sekolah:', error);
        alert('Terjadi kesalahan saat menghapus data.');
    }
}

// Render dropdown menu with schools
function renderDropdown(schools) {
    dropdownMenu.innerHTML = '';
    schools.forEach(school => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<button class="dropdown-item" type="button" data-id="${school._id}">${school.name}</button>`;
        dropdownMenu.appendChild(listItem);
    });

    // Add event listeners to dropdown items
    dropdownMenu.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', async (e) => {
            const schoolId = e.target.getAttribute('data-id');
            const schoolName = e.target.textContent;
            selectedSchoolNameElement.textContent = schoolName;
            await loadChart(schoolId);
            await loadJumlahSiswa(schoolId);
            await loadJumlahGuru(schoolId);
        });
    });
}

function addSchool() {
    const schoolName = document.getElementById('schoolName').value;
    const schoolAddress = document.getElementById('schoolAddress').value;
    const schoolYear = document.getElementById('schoolYear').value;

    const danaBosInputs = document.querySelectorAll('.bos-tahun, .bos-jumlah');
    const danaBos = [];
    for (let i = 0; i < danaBosInputs.length; i += 2) {
        const tahun = danaBosInputs[i].value;
        const jumlah = danaBosInputs[i + 1].value;
        if (tahun && jumlah) {
            danaBos.push({ tahun: parseInt(tahun), jumlah: parseInt(jumlah) });
        }
    }

    const danaAnggaranInputs = document.querySelectorAll('.anggaran-tahun, .anggaran-jumlah');
    const danaAnggaran = [];
    for (let i = 0; i < danaAnggaranInputs.length; i += 2) {
        const tahun = danaAnggaranInputs[i].value;
        const jumlah = danaAnggaranInputs[i + 1].value;
        if (tahun && jumlah) {
            danaAnggaran.push({ tahun: parseInt(tahun), jumlah: parseInt(jumlah) });
        }
    }

    const schoolData = {
        name: schoolName,
        alamat: schoolAddress,
        tahun: parseInt(schoolYear),
        dana_bos: danaBos,
        dana_anggaran: danaAnggaran
    };

    fetch('http://localhost:5000/sekolah/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(schoolData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Sekolah berhasil ditambahkan:', data);
        alert('Sekolah berhasil ditambahkan');
        fetchSchools(); // Fungsi untuk memuat ulang tabel sekolah
        // Reset form after submission
        document.getElementById('addSchoolForm').reset();
        const modal = bootstrap.Modal.getInstance(document.getElementById('addSchoolModal'));
        modal.hide();
        
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Terjadi kesalahan saat menambahkan sekolah');
    });
}