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
                resultItem.classList.add("result-item", "p-2", "border", "mb-2");
                resultItem.textContent = school.name;
                resultItem.setAttribute("data-id", school._id);

                resultItem.onclick = function () {
                    document.getElementById("searchInput").value = school.name;
                    document.getElementById("selectedSchoolId").value = school._id;
                    console.log("ID Sekolah disimpan:", school._id);
                    resultDiv.innerHTML = ''; // Kosongkan hasil pencarian setelah dipilih
                    renderStudentTable(school._id); // Muat data siswa berdasarkan ID sekolah
                };

                resultDiv.appendChild(resultItem);
            });
        } else {
            resultDiv.innerHTML = "<p class='text-danger'>Sekolah tidak ditemukan.</p>";
        }
    } catch (error) {
        console.error("Terjadi kesalahan saat mengambil data:", error);
        document.getElementById("searchResult").innerHTML = "<p class='text-danger'>Terjadi kesalahan saat memuat data.</p>";
    }
}

// Fungsi untuk menampilkan data siswa di tabel
async function renderStudentTable(schoolId) {
    try {
        const response = await fetch(`http://localhost:5000/guru/sekolah/${schoolId}`);
        if (!response.ok) throw new Error('Gagal mengambil data siswa');
        const students = await response.json();

        const studentTableBody = document.getElementById("studentTableBody");
        studentTableBody.innerHTML = ''; // Bersihkan tabel

        students.forEach((student, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${student.name}</td>
                <td>${student.alamat}</td>
                <td>
                    <button class="btn btn-info btn-sm" onclick="viewStudentDetails(${JSON.stringify(student).replace(/"/g, '&quot;')})">
                        Detail
                    </button>
                </td>
            `;
            studentTableBody.appendChild(row);
        });

        // Menampilkan nama sekolah
        document.getElementById("schoolName").textContent = `Nama Sekolah: ${students[0]?.sekolah.name || "Tidak ditemukan"}`;
    } catch (error) {
        console.error("Gagal memuat data siswa:", error);
        document.getElementById("studentTableBody").innerHTML = '<tr><td colspan="5" class="text-center text-danger">Gagal memuat data siswa.</td></tr>';
    }
}

// Fungsi untuk menampilkan detail siswa di modal
function viewStudentDetails(student) {
    const modalContent = `
        <div class="modal fade" id="studentDetailModal" tabindex="-1" aria-labelledby="studentDetailModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="studentDetailModalLabel">Detail Guru</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p><strong>Nama:</strong> ${student.name}</p>
                        <p><strong>Tanggal Masuk:</strong> ${new Date(student.tanggal_masuk).toLocaleDateString()}</p>
                        <p><strong>Tanggal Lahir:</strong> ${new Date(student.tanggal_lahir).toLocaleDateString()}</p>
                        <p><strong>Jenis Kelamin:</strong> ${student.kelamin}</p>
                        <p><strong>Alamat:</strong> ${student.alamat}</p>
                        <p><strong>status:</strong> ${student.status}</p>
                        <hr>
                        <h6>Mata Pelajaran:</h6>
                        <ul>
                            ${student.mata_pelajaran.map(sub => `<li>${sub.mata_pelajaran}`).join('')}
                        </ul>
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
    const modalInstance = new bootstrap.Modal(document.getElementById('studentDetailModal'));
    modalInstance.show();

    // Hapus modal dari DOM setelah ditutup
    document.getElementById('studentDetailModal').addEventListener('hidden.bs.modal', () => {
        document.getElementById('studentDetailModal').remove();
    });
}
