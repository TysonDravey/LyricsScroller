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
            const song = getSongByI