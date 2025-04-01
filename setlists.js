// DOM Elements - Setlists 
const setlistsList = document.getElementById('setlists-list');
const setlistsEmptyState = document.getElementById('setlists-empty-state');
const addSetlistBtn = document.getElementById('add-setlist-btn');
const setlistDetailView = document.getElementById('setlist-detail-view');
const setlistTitle = document.getElementById('setlist-title');
const setlistSongs = document.getElementById('setlist-songs');
const setlistDetailEmpty = document.getElementById('setlist-detail-empty');
const setlistBackBtn = document.getElementById('setlist-back-btn');
const editSetlistBtn = document.getElementById('edit-setlist-btn');
const startGigBtn = document.getElementById('start-gig-btn');

// DOM Elements - Setlist Edit
const setlistEditView = document.getElementById('setlist-edit-view');
const setlistEditBackBtn = document.getElementById('setlist-edit-back-btn');
const setlistNameInput = document.getElementById('setlist-name-input');
const setlistEditSongs = document.getElementById('setlist-edit-songs');
const availableSongs = document.getElementById('available-songs');
const saveSetlistBtn = document.getElementById('save-setlist-btn');

// Add these DOM element definitions at the top of your setlists.js file
// (Only add the ones that aren't already defined)
const gigView = document.getElementById('gig-view');
const gigSongTitle = document.getElementById('gig-song-title');
const gigLyricsText = document.getElementById('gig-lyrics-text');
const gigLyricsScroll = document.getElementById('gig-lyrics-scroll');
const songPosition = document.getElementById('song-position');
// Initialize sortable for setlist editing
let setlistSortable = null;

// Render setlists list
function renderSetlistsList() {
    setlistsList.innerHTML = '';
    if (setlists.length === 0) {
        setlistsEmptyState.classList.remove('hidden');
    } else {
        setlistsEmptyState.classList.add('hidden');
        setlists.forEach((setlist, index) => {
            const songCount = setlist.songs.length;
            const li = document.createElement('li');
            li.className = 'song-item';
            li.innerHTML = `
                <div class="setlist-info">
                    <span class="song-title">${setlist.name}</span>
                    <span class="small-text">${songCount} song${songCount !== 1 ? 's' : ''}</span>
                </div>
                <div class="song-actions">
                    <button class="btn btn-primary edit-btn">Edit</button>
                    <button class="btn btn-danger delete-btn">Delete</button>
                </div>
            `;
            li.querySelector('.edit-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                editSetlist(index);
            });
            li.querySelector('.delete-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                deleteSetlist(index);
            });
            li.addEventListener('click', () => showSetlistDetail(index));
            setlistsList.appendChild(li);
        });
    }
}

// Show setlist detail
function showSetlistDetail(index) {
    currentSetlistIndex = index;
    const setlist = setlists[index];
    setlistTitle.textContent = setlist.name;
    
    renderSetlistDetailSongs(setlist);
    
    mainView.classList.add('hidden');
    setlistDetailView.classList.remove('hidden');
}

// Render songs in setlist detail view
function renderSetlistDetailSongs(setlist) {
    setlistSongs.innerHTML = '';
    
    if (setlist.songs.length === 0) {
        setlistDetailEmpty.classList.remove('hidden');
        startGigBtn.disabled = true;
        startGigBtn.classList.add('btn-danger');
        startGigBtn.classList.remove('btn-success');
    } else {
        setlistDetailEmpty.classList.add('hidden');
        startGigBtn.disabled = false;
        startGigBtn.classList.remove('btn-danger');
        startGigBtn.classList.add('btn-success');
        
        setlist.songs.forEach((songId, index) => {
            const song = getSongById(songId);
            if (song) {
                const li = document.createElement('li');
                li.className = 'setlist-item';
                li.innerHTML = `
                    <span class="song-number">${index + 1}.</span>
                    <span class="song-title">${song.title}</span>
                `;
                li.addEventListener('click', () => showSongDetail(songs.findIndex(s => s.id === songId)));
                setlistSongs.appendChild(li);
            }
        });
    }
}

// Add new setlist
function addNewSetlist() {
    editingSetlistIndex = null;
    setlistNameInput.value = '';
    setlistEditSongs.innerHTML = '';
    
    renderAvailableSongs({ songs: [] });
    
    // Initialize sortable
    initSetlistSortable();
    
    mainView.classList.add('hidden');
    setlistEditView.classList.remove('hidden');
}

// Edit existing setlist
function editSetlist(index) {
    editingSetlistIndex = index;
    const setlist = setlists[index];
    setlistNameInput.value = setlist.name;
    
    renderSetlistEditSongs(setlist);
    renderAvailableSongs(setlist);
    
    // Initialize sortable
    initSetlistSortable();
    
    mainView.classList.add('hidden');
    setlistDetailView.classList.add('hidden');
    setlistEditView.classList.remove('hidden');
}

// Initialize the sortable list for setlist editing
function initSetlistSortable() {
    if (setlistSortable) {
        setlistSortable.destroy();
    }
    
    setlistSortable = new Sortable(setlistEditSongs, {
        animation: 150,
        handle: '.handle',
        onEnd: function() {
            // The order will be saved when the user clicks save
        }
    });
}

// Render songs in setlist edit view
function renderSetlistEditSongs(setlist) {
    setlistEditSongs.innerHTML = '';
    
    setlist.songs.forEach((songId) => {
        const song = getSongById(songId);
        if (song) {
            const li = document.createElement('li');
            li.className = 'setlist-item';
            li.dataset.songId = songId;
            li.innerHTML = `
                <div class="handle">≡</div>
                <span class="song-title">${song.title}</span>
                <button class="btn btn-danger remove-btn">Remove</button>
            `;
            li.querySelector('.remove-btn').addEventListener('click', () => {
                li.remove();
            });
            setlistEditSongs.appendChild(li);
        }
    });
}

// Render available songs for adding to setlist
function renderAvailableSongs(setlist) {
    availableSongs.innerHTML = '';
    
    songs.forEach((song) => {
        // Only show songs not already in the setlist
        if (!setlist.songs.includes(song.id)) {
            const li = document.createElement('li');
            li.className = 'song-item';
            li.innerHTML = `
                <span class="song-title">${song.title}</span>
                <button class="btn btn-success add-to-setlist">Add</button>
            `;
            li.querySelector('.add-to-setlist').addEventListener('click', () => {
                addSongToEditingSetlist(song.id);
            });
            availableSongs.appendChild(li);
        }
    });
}

// Add song to editing setlist
function addSongToEditingSetlist(songId) {
    const song = getSongById(songId);
    if (!song) return;
    
    const li = document.createElement('li');
    li.className = 'setlist-item';
    li.dataset.songId = songId;
    li.innerHTML = `
        <div class="handle">≡</div>
        <span class="song-title">${song.title}</span>
        <button class="btn btn-danger remove-btn">Remove</button>
    `;
    li.querySelector('.remove-btn').addEventListener('click', () => {
        li.remove();
    });
    setlistEditSongs.appendChild(li);
    
    // Update available songs
    const songElement = availableSongs.querySelector(`[data-song-id="${songId}"]`);
    if (songElement) {
        songElement.remove();
    } else {
        // Refresh the available songs list
        const currentSongIds = Array.from(setlistEditSongs.children).map(child => child.dataset.songId);
        renderAvailableSongs({ songs: currentSongIds });
    }
}

// Save setlist
function saveSetlist() {
    const name = setlistNameInput.value.trim();
    
    if (!name) {
        alert('Please enter a setlist name');
        return;
    }
    
    // Get song IDs from the sortable list
    const songIds = Array.from(setlistEditSongs.children).map(child => child.dataset.songId);
    
    if (editingSetlistIndex !== null) {
        // Update existing setlist
        setlists[editingSetlistIndex].name = name;
        setlists[editingSetlistIndex].songs = songIds;
    } else {
        // Add new setlist
        const newSetlist = {
            id: Date.now().toString(),
            name: name,
            songs: songIds
        };
        setlists.push(newSetlist);
    }
    
    saveData();
    renderSetlistsList();
    showMainView();
}

// Delete setlist
function deleteSetlist(index) {
    if (confirm(`Are you sure you want to delete "${setlists[index].name}"?`)) {
        setlists.splice(index, 1);
        saveData();
        renderSetlistsList();
    }
}

// Start gig mode with the current setlist
function startGig() {
    if (currentSetlistIndex === null) return;
    
    const setlist = setlists[currentSetlistIndex];
    currentGigSetlist = setlist;
    currentGigSongIndex = 0;
    
    showGigView();
}
// Add this to setlists.js
function showGigView() {
    if (!currentGigSetlist || currentGigSetlist.songs.length === 0) return;
    
    // Make sure currentGigSongIndex is set
    currentGigSongIndex = 0;
    
    // Load the first song
    const songId = currentGigSetlist.songs[currentGigSongIndex];
    const song = getSongById(songId);
    
    if (song) {
        gigSongTitle.textContent = song.title;
        gigLyricsText.textContent = song.lyrics;
        gigLyricsText.style.fontSize = `${globalFontSize || 18}px`;
        
        // Reset scroll position
        gigLyricsScroll.scrollTop = 0;
        
        // Update position indicator
        songPosition.textContent = `${currentGigSongIndex + 1}/${currentGigSetlist.songs.length}`;
    }
    
    // Show the gig view
    setlistDetailView.classList.add('hidden');
    gigView.classList.remove('hidden');
}
// Setup setlist events
function setupSetlistEvents() {
    addSetlistBtn.addEventListener('click', addNewSetlist);
    setlistBackBtn.addEventListener('click', showMainView);
    editSetlistBtn.addEventListener('click', () => editSetlist(currentSetlistIndex));
    setlistEditBackBtn.addEventListener('click', () => {
        // If we were editing an existing setlist, go back to setlist detail
        if (editingSetlistIndex !== null) {
            showSetlistDetail(editingSetlistIndex);
        } else {
            showMainView();
        }
    });
    saveSetlistBtn.addEventListener('click', saveSetlist);
    startGigBtn.addEventListener('click', startGig);
    startGigBtn.addEventListener('click', debugGigStart);
}

// Add this to your app.js or in your browser console to debug
function debugGigStart() {
    console.log("Debug: Trying to start gig manually");
    
    // Check if currentSetlistIndex is valid
    console.log("currentSetlistIndex:", currentSetlistIndex);
    
    // Try to get the setlist
    const setlist = setlists[currentSetlistIndex];
    console.log("Current setlist:", setlist);
    
    if (setlist) {
        // Set up gig variables
        currentGigSetlist = setlist;
        currentGigSongIndex = 0;
        
        // Force show gig view
        setlistDetailView.classList.add('hidden');
        gigView.classList.remove('hidden');
        
        // Try to load the first song
        console.log("Loading first song...");
        const songId = setlist.songs[0];
        const song = getSongById(songId);
        console.log("First song:", song);
        
        if (song) {
            gigSongTitle.textContent = song.title;
            gigLyricsText.textContent = song.lyrics;
            gigLyricsText.style.fontSize = `${globalFontSize || 18}px`;
            songPosition.textContent = `1/${setlist.songs.length}`;
        }
    }
}

// You can call this function from your browser console or link it to the button