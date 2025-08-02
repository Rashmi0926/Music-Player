const audio = document.getElementById('audio');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const progressBar = document.getElementById('progress-bar');
const volumeControl = document.getElementById('volume');
const playlistList = document.getElementById('playlist-list');

let isPlaying = false;
let songIndex = 0;

// Arijit Singh popular songs sample - replace src with valid mp3 URLs or local paths
const songs = [
  {
    title: "Tum Hi Ho",
    artist: "Arijit Singh",
    src: "music/Tum hi ho.mp3"
  },
  {
    title: "Saiyara",
    artist: "Faheem Abdullah",
    src: "music/Saiyara.mp3"
  },
  
  {
    title: "Raabta",
    artist: "Arijit Singh",
    src: "music/raabta.mp3"
  },
  {
    title: "Andhekhi Anjaani Si",
    artist: "Lata Mangeshkar, Udit Narayan",
    src: "music/Andekhi anjaani si.mp3"
  },
  {
    title: "Tum Se Hi",
    artist: "Mohit Chauhan",
    src: "music/Tum se hi.mp3"
  }
];

// Load selected song and update UI
function loadSong(index) {
  const song = songs[index];
  audio.src = song.src;
  title.textContent = song.title;
  artist.textContent = song.artist;
  updatePlaylistActive(index);
}

// Play audio and update button
function playSong() {
  audio.play()
    .then(() => {
      isPlaying = true;
      playBtn.innerHTML = "&#10074;&#10074;"; // Pause icon
    })
    .catch(err => {
      console.error("Playback error:", err);
    });
}

// Pause audio and update button
function pauseSong() {
  audio.pause();
  isPlaying = false;
  playBtn.innerHTML = "&#9654;"; // Play icon
}

// Toggle play and pause
playBtn.addEventListener('click', () => {
  isPlaying ? pauseSong() : playSong();
});

// Previous song with wrap-around
prevBtn.addEventListener('click', () => {
  songIndex = (songIndex - 1 + songs.length) % songs.length;
  loadSong(songIndex);
  playSong();
});

// Next song with wrap-around
nextBtn.addEventListener('click', () => {
  songIndex = (songIndex + 1) % songs.length;
  loadSong(songIndex);
  playSong();
});

// Update progress bar and timer display
audio.addEventListener('timeupdate', () => {
  if (audio.duration) {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progressBar.value = progressPercent;
    currentTimeEl.textContent = formatTime(audio.currentTime);
    durationEl.textContent = formatTime(audio.duration);
  }
});

// Seek audio on progress bar change
progressBar.addEventListener('input', () => {
  if (audio.duration) {
    audio.currentTime = (progressBar.value / 100) * audio.duration;
  }
});

// Volume control linked to audio volume
volumeControl.addEventListener('input', () => {
  audio.volume = volumeControl.value;
});

// Format time in mm:ss
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins < 10 ? "0" + mins : mins}:${secs < 10 ? "0" + secs : secs}`;
}

// Load playlist items in UI
function loadPlaylist() {
  playlistList.innerHTML = '';
  songs.forEach((song, index) => {
    let li = document.createElement('li');
    li.textContent = `${song.title} - ${song.artist}`;
    li.addEventListener('click', () => {
      songIndex = index;
      loadSong(songIndex);
      playSong();
    });
    playlistList.appendChild(li);
  });
}

// Highlight currently playing song in playlist
function updatePlaylistActive(index) {
  [...playlistList.children].forEach((li, i) => {
    li.classList.toggle('active', i === index);
  });
}

// Autoplay next song after current ends
audio.addEventListener('ended', () => {
  nextBtn.click();
});

// Initial setup
loadPlaylist();
loadSong(songIndex);
audio.volume = volumeControl.value;
