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
// Mengambil ID dari URL
const params = new URLSearchParams(window.location.search);
const videoId = params.get('id');

// Memastikan ID video ada
if (!videoId) {
    document.getElementById('videoInfo').innerHTML = `<p>ID video tidak ditemukan.</p>`;
}

// Mengambil data video dari localStorage
const videoList = JSON.parse(localStorage.getItem('videoList')) || [];
const video = videoList.find(v => v.id === videoId);

// Inisialisasi data suka dan komentar
let videoData = JSON.parse(localStorage.getItem(`videoData_${videoId}`)) || {
    likeCount: 0,
    dislikeCount: 0,
    liked: false,
    disliked: false,
    comments: []
};

// Memeriksa apakah nama pengguna sudah ada di localStorage
const storedUsername = localStorage.getItem(`username_${videoId}`);

if (storedUsername) {
    // Jika nama pengguna sudah ada, setel nama ke input dan nonaktifkan input
    document.getElementById('username').value = storedUsername;
    document.getElementById('username').disabled = true; // Menonaktifkan input nama
}

// Fungsi untuk memperbarui tampilan jumlah suka dan tidak suka
function updateLikeDislikeDisplay() {
    document.getElementById('likeCount').innerText = videoData.likeCount;
    document.getElementById('dislikeCount').innerText = videoData.dislikeCount;
}

// Menambahkan event listener pada tombol suka dan tidak suka
document.getElementById('likeButton').addEventListener('click', function() {
    if (videoData.liked) { // Jika pengguna sudah memberi suka
        videoData.likeCount--; // Kurangi jumlah suka
        videoData.liked = false; // Setel ulang status
    } else {
        videoData.likeCount++; // Tambah jumlah suka
        videoData.liked = true; // Tandai bahwa pengguna sudah memberi suka
    }
    localStorage.setItem(`videoData_${videoId}`, JSON.stringify(videoData)); // Simpan data di localStorage
    updateLikeDislikeDisplay();
});

document.getElementById('dislikeButton').addEventListener('click', function() {
    if (videoData.disliked) { // Jika pengguna sudah memberi tidak suka
        videoData.dislikeCount--; // Kurangi jumlah tidak suka
        videoData.disliked = false; // Setel ulang status
    } else {
        videoData.dislikeCount++; // Tambah jumlah tidak suka
        videoData.disliked = true; // Tandai bahwa pengguna sudah memberi tidak suka
    }
    localStorage.setItem(`videoData_${videoId}`, JSON.stringify(videoData)); // Simpan data di localStorage
    updateLikeDislikeDisplay();
});

// Menampilkan informasi video dan pemutar video
if (video) {
    document.getElementById('videoInfo').innerHTML = `
        <h2 class="video-title">${video.title}</h2>
        ${getVideoPlayer(video.source)}
    `;
    initPlayer(video.source); // Memanggil initPlayer setelah menampilkan video
} else {
    document.getElementById('videoInfo').innerHTML = `<p>Video tidak ditemukan.</p>`;
}

// Fungsi untuk mendapatkan pemutar video
function getVideoPlayer(source) {
    return `
        <video id="video" controls class="video-player" width="100%" height="auto">
            <source src="${source}" type="application/x-mpegURL">
            Your browser does not support the video tag.
        </video>
    `;
}

// Memutar video HLS jika source adalah m3u8
function initPlayer(source) {
    const videoElement = document.getElementById('video');

    if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(source);
        hls.attachMedia(videoElement);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
            videoElement.play();
        });
    } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        // Untuk browser Safari
        videoElement.src = source;
        videoElement.addEventListener('loadedmetadata', function () {
            videoElement.play();
        });
    } else {
        console.error('Browser tidak mendukung HLS');
        document.getElementById('videoInfo').innerHTML = `<p>Video tidak dapat diputar. Browser Anda tidak mendukung format ini.</p>`;
    }
}

// Fungsi untuk kembali ke halaman sebelumnya
function goBack() {
    window.history.back(); // Kembali ke halaman sebelumnya
}

// Fungsi pencarian video
document.getElementById('searchButton').addEventListener('click', function() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    window.location.href = `index.html?search=${searchText}`; // Mengarahkan ke halaman index dengan parameter pencarian
});

// Menambahkan event listener pada tombol kirim komentar
document.getElementById('submitCommentButton').addEventListener('click', function() {
    const usernameInput = document.getElementById('username');
    const commentText = document.getElementById('commentInput').value.trim();
    const username = usernameInput.value.trim();

    if (username && commentText) {
        // Simpan nama pengguna di localStorage jika belum ada
        if (!storedUsername) {
            localStorage.setItem(`username_${videoId}`, username);
            usernameInput.disabled = true; // Kunci nama pengguna segera
        }

        const comment = {
            author: username,
            text: commentText,
            time: new Date().toLocaleString() // Mendapatkan waktu saat ini
        };
        videoData.comments.push(comment); // Menambahkan komentar ke array
        localStorage.setItem(`videoData_${videoId}`, JSON.stringify(videoData)); // Simpan data di localStorage
        
        // Tambahkan komentar dan perbarui jumlah komentar dengan delay 2 detik
        setTimeout(() => {
            displayComments(); // Memperbarui tampilan komentar
            updateCommentCount(); // Memperbarui jumlah komentar
        }, 2000);
        
        document.getElementById('commentInput').value = ''; // Mengosongkan input komentar
    } else {
        alert("Nama dan komentar tidak boleh kosong."); // Peringatan jika input kosong
    }
});

// Fungsi untuk menampilkan komentar
function displayComments() {
    const commentSection = document.getElementById('commentSection');
    commentSection.innerHTML = ''; // Kosongkan tampilan sebelum menampilkan ulang

    // Tampilkan komentar dari yang lama ke yang terbaru
    videoData.comments.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment';

        // Mengatur konten komentar
        commentDiv.innerHTML = `
            <span class="comment-author">${comment.author}</span>
            <span class="comment-time">${comment.time}</span>
            <p>${comment.text}</p>
        `;
        
        commentSection.appendChild(commentDiv);
    });

    // Gulir ke bawah untuk menampilkan komentar terbaru
    commentSection.scrollTop = commentSection.scrollHeight;
}

// Fungsi untuk memperbarui jumlah komentar di tampilan
function updateCommentCount() {
    const commentCountDisplay = document.getElementById('commentCountDisplay');
    commentCountDisplay.textContent = `Komentar (${videoData.comments.length})`;
}

// Memperbarui tampilan jumlah suka, tidak suka, dan komentar saat dimuat
updateLikeDislikeDisplay();
displayComments();
updateCommentCount();