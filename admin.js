let videoList = JSON.parse(localStorage.getItem('videoList')) || []; // Mengambil data dari localStorage
const videosPerPage = 5; // Batasi jumlah video per halaman
let currentPage = 1; // Halaman saat ini
let editingIndex = -1; // Variabel untuk melacak item yang sedang diedit

// Fungsi untuk menghasilkan ID video acak
function generateRandomId() {
    const randomId = Math.floor(100 + Math.random() * 900); // Menghasilkan angka acak antara 100 dan 999
    return `vid${randomId}`; // Format ID
}

// Fungsi untuk menyimpan video ke localStorage
function saveToLocalStorage() {
    localStorage.setItem('videoList', JSON.stringify(videoList));
}

// Fungsi untuk merender daftar video
function renderVideoList() {
    const list = document.getElementById('list');
    list.innerHTML = ''; // Kosongkan daftar sebelum merender ulang

    // Daftar video diurutkan dari terlama ke terbaru
    const start = (currentPage - 1) * videosPerPage;
    const end = start + videosPerPage;

    // Ambil video untuk halaman saat ini
    const paginatedVideos = videoList.slice().reverse().slice(start, end); // Ambil video sesuai halaman

    paginatedVideos.forEach((video) => {
        const listItem = document.createElement('li');
        listItem.className = 'video-item';
        listItem.innerHTML = `
            <strong>ID:</strong> ${video.id}<br>
            <strong>Judul:</strong> ${video.title}<br>
            <strong>Sumber:</strong> <a href="${video.source}" target="_blank">${video.source}</a><br>
            <strong>URL Poster:</strong> <a href="${video.poster}" target="_blank">${video.poster}</a><br>
            <button onclick="editVideo('${video.id}')">Edit</button>
            <button onclick="deleteVideo('${video.id}')">Hapus</button>
        `;
        list.appendChild(listItem);
    });

    // Update tombol prev dan next
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = end >= videoList.length;
}

// Menginisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    renderVideoList(); // Render daftar video yang ada di localStorage
});

// Event listener untuk menambahkan video
document.getElementById('videoForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Mencegah pengiriman form

    const title = document.getElementById('title').value;
    const source = document.getElementById('source').value;
    const poster = document.getElementById('poster').value; // Ambil URL dari input

    if (editingIndex !== -1) {
        // Jika dalam mode edit, perbarui video yang ada
        videoList[editingIndex] = { id: videoList[editingIndex].id, title, source, poster };
        editingIndex = -1; // Reset status edit setelah diperbarui
    } else {
        // Tambahkan video baru
        const id = generateRandomId(); // Generate ID secara acak
        videoList.push({ id, title, source, poster }); // Tambahkan ke bagian akhir array
    }

    saveToLocalStorage(); // Simpan daftar video ke localStorage
    renderVideoList(); // Render ulang daftar video

    // Reset form
    document.getElementById('videoForm').reset();
});

// Fungsi untuk mengedit video
function editVideo(id) {
    editingIndex = videoList.findIndex(video => video.id === id); // Temukan indeks video yang akan diedit
    const video = videoList[editingIndex];

    // Isi kembali form dengan data yang sudah ada
    document.getElementById('title').value = video.title;
    document.getElementById('source').value = video.source;
    document.getElementById('poster').value = video.poster; // Menampilkan URL poster yang ada
}

// Fungsi untuk menghapus video dengan konfirmasi
function deleteVideo(id) {
    const confirmed = confirm("Apakah Anda yakin ingin menghapus video ini?");
    if (confirmed) {
        videoList = videoList.filter(video => video.id !== id); // Hapus item berdasarkan ID
        saveToLocalStorage(); // Simpan perubahan ke localStorage
        renderVideoList(); // Render ulang daftar video setelah dihapus
    }
}

// Fungsi untuk navigasi halaman berikutnya
document.getElementById('nextPage').addEventListener('click', function() {
    currentPage++;
    renderVideoList();
});

// Fungsi untuk navigasi halaman sebelumnya
document.getElementById('prevPage').addEventListener('click', function() {
    currentPage--;
    renderVideoList();
});