// DOM Elements - Songs List
const songsList = document.getElementById('songs-list');
const songsEmptyState = document.getElementById('songs-empty-state');
const addSongBtn = document.getElementById('add-song-btn');

// DOM Elements - Song Detail
const songDetailView = document.getElementById('song-detail-view');
const songTitleElement = document.getElementById('song-title');
const lyricsText = document.getElementById('lyrics-text');
const lyricsScroll = document.getElementById('lyrics-scroll');
const backBtn = document.getElementById('back-btn');
const editSongBtn = document.getElementById('edit-song-btn');
const startScrollBtn = document.getElementById('start-scroll-btn');
const scrollSpeedSlider = document.getElementById('scroll-speed');
const speedValue = document.getElementById('speed-value');
const fontSizeSlider = document.getElementById('font-size');
const fontSizeValue = document.getElementById('font-size-value');

// DOM Elements - Song Edit
const songEditView = document.getElementById('song-edit-view');
const songTitleInput = document.getElementById('song-title-input');
const songLyricsInput = document.getElementById('song-lyrics-input');
const saveBtn = document.getElementById('save-song-btn');
const cancelEditBtn = document.getElementById('cancel-edit-btn');
const editTitle = document.getElementById('edit-title');

// Render song list
function renderSongList() {
    songsList.innerHTML = '';
    if (songs.length === 0) {
        songsEmptyState.classList.remove('hidden');
    } else {
        songsEmptyState.classList.add('hidden');
        songs.forEach((song, index) => {
            const li = document.createElement('li');
            li.className = 'song-item';
            li.innerHTML = `
                <span class="song-title">${song.title}</span>
                <div class="song-actions">
                    <button class="btn btn-primary edit-btn">Edit</button>
                    <button class="btn btn-danger delete-btn">Delete</button>
                </div>
            `;
            li.querySelector('.edit-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                editSong(index);
            });
            li.querySelector('.delete-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                deleteSong(index);
            });
            li.addEventListener('click', () => showSongDetail(index));
            songsList.appendChild(li);
        });
    }
}

// Show song detail view
function showSongDetail(index) {
    currentSongIndex = index;
    const song = songs[index];
    songTitleElement.textContent = song.title;
    lyricsText.textContent = song.lyrics;
    lyricsText.style.fontSize = `${song.fontSize}px`;
    scrollSpeedSlider.value = song.scrollSpeed;
    speedValue.textContent = song.scrollSpeed;
    fontSizeSlider.value = song.fontSize;
    fontSizeValue.textContent = song.fontSize;
    
    mainView.classList.add('hidden');
    songDetailView.classList.remove('hidden');
    
    // Reset scroll position
    lyricsScroll.scrollTop = 0;
}

// Add new song
function addNewSong() {
    editingIndex = null;
    songTitleInput.value = '';
    songLyricsInput.value = '';
    editTitle.textContent = 'Add New Song';
    
    mainView.classList.add('hidden');
    songDetailView.classList.add('hidden');
    songEditView.classList.remove('hidden');
}

// Edit existing song
function editSong(index) {
    editingIndex = index;
    const song = songs[index];
    songTitleInput.value = song.title;
    songLyricsInput.value = song.lyrics;
    editTitle.textContent = 'Edit Song';
    
    mainView.classList.add('hidden');
    songDetailView.classList.add('hidden');
    songEditView.classList.remove('hidden');
}

// Save song
function saveSong() {
    const title = songTitleInput.value.trim();
    const lyrics = songLyricsInput.value;
    
    if (!title) {
        alert('Please enter a song title');
        return;
    }
    
    if (editingIndex !== null) {
        // Update existing song
        songs[editingIndex].title = title;
        songs[editingIndex].lyrics = lyrics;
    } else {
        // Add new song
        const newSong = {
            id: Date.now().toString(),
            title: title,
            lyrics: lyrics,
            scrollSpeed: 5,
            fontSize: 18
        };
        songs.push(newSong);
    }
    
    saveData();
    renderSongList();
    showMainView();
}

// Delete song
function deleteSong(index) {
    if (confirm(`Are you sure you want to delete "${songs[index].title}"?`)) {
        const songId = songs[index].id;
        
        // Remove song from any setlists
        setlists.forEach(setlist => {
            setlist.songs = setlist.songs.filter(id => id !== songId);
        });
        
        // Remove the song
        songs.splice(index, 1);
        saveData();
        renderSongList();
    }
}

// Update scroll speed
function updateScrollSpeed() {
    const value = scrollSpeedSlider.value;
    speedValue.textContent = value;
    if (currentSongIndex !== null) {
        songs[currentSongIndex].scrollSpeed = parseInt(value);
        saveData();
    }
}

// Update font size
function updateFontSize() {
    const value = fontSizeSlider.value;
    fontSizeValue.textContent = value;
    if (currentSongIndex !== null) {
        songs[currentSongIndex].fontSize = parseInt(value);
        lyricsText.style.fontSize = `${value}px`;
        saveData();
    }
}

// Song events setup
function setupSongEvents() {
    addSongBtn.addEventListener('click', addNewSong);
    backBtn.addEventListener('click', showMainView);
    editSongBtn.addEventListener('click', () => editSong(currentSongIndex));
    saveBtn.addEventListener('click', saveSong);
    cancelEditBtn.addEventListener('click', showMainView);
    scrollSpeedSlider.addEventListener('input', updateScrollSpeed);
    fontSizeSlider.addEventListener('input', updateFontSize);
    startScrollBtn.addEventListener('click', startSongScrolling);
}