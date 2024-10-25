// Fungsi untuk menampilkan atau menyembunyikan bagian 'About'
document.getElementById("aboutLink").addEventListener("click", function(event) {
    event.preventDefault();
    const aboutSection = document.getElementById("aboutSection");
    if (aboutSection.style.display === "none") {
        aboutSection.style.display = "block";
    } else {
        aboutSection.style.display = "none";
    }
});

// Inisialisasi data video dan variabel lainnya
let videoList = JSON.parse(localStorage.getItem('videoList')) || [];
const videosPerPage = 5;
let currentPage = 1;

// Fungsi untuk merender daftar video sesuai halaman dan pencarian
function renderVideoList(filteredVideos = videoList) {
    const list = document.getElementById('list');
    list.innerHTML = '';

    const start = (currentPage - 1) * videosPerPage;
    const end = start + videosPerPage;

    const paginatedVideos = filteredVideos.slice().reverse().slice(start, end);

    paginatedVideos.forEach((video) => {
        const listItem = document.createElement('li');
        listItem.className = 'video-item';
        listItem.innerHTML = `
            <img src="${video.poster}" alt="${video.title} Poster" class="video-poster" onclick="openVideoPlayer('${video.id}')">
            <span class="video-title" onclick="openVideoPlayer('${video.id}')">${video.title}</span>
        `;
        list.appendChild(listItem);
    });

    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = end >= filteredVideos.length;
}

// Fungsi untuk membuka pemutar video
function openVideoPlayer(id) {
    window.location.href = `videoPlayer.html?id=${id}`;
}

// Fungsi untuk mengubah halaman berikutnya
document.getElementById('nextPage').addEventListener('click', function() {
    currentPage++;
    renderVideoList();
});

// Fungsi untuk mengubah halaman sebelumnya
document.getElementById('prevPage').addEventListener('click', function() {
    currentPage--;
    renderVideoList();
});

// Fungsi pencarian berdasarkan judul video
function searchVideos() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    const filteredVideos = videoList.filter(video =>
        video.title.toLowerCase().includes(searchText)
    );
    currentPage = 1; // Reset ke halaman pertama setelah pencarian
    renderVideoList(filteredVideos);
}

// Event listener untuk pencarian saat tombol 'Cari' diklik atau saat input berubah
document.getElementById('searchInput').addEventListener('input', searchVideos);
document.getElementById('searchButton').addEventListener('click', searchVideos);

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    renderVideoList();
});