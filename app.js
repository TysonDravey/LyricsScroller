// DOM Elements - Main Navigation
const mainView = document.getElementById('main-view');
const songsTab = document.getElementById('songs-tab');
const setlistsTab = document.getElementById('setlists-tab');
const songsContent = document.getElementById('songs-content');
const setlistsContent = document.getElementById('setlists-content');

// Tab switching
function switchTab(tab) {
    if (tab === 'songs') {
        songsTab.classList.add('active');
        setlistsTab.classList.remove('active');
        songsContent.classList.remove('hidden');
        setlistsContent.classList.add('hidden');
    } else {
        songsTab.classList.remove('active');
        setlistsTab.classList.add('active');
        songsContent.classList.add('hidden');
        setlistsContent.classList.remove('hidden');
    }
}

// Show main view
function showMainView() {
    mainView.classList.remove('hidden');
    songDetailView.classList.add('hidden');
    songEditView.classList.add('hidden');
    setlistDetailView.classList.add('hidden');
    setlistEditView.classList.add('hidden');
    gigView.classList.add('hidden');
}

// Setup tab navigation
function setupTabEvents() {
    songsTab.addEventListener('click', () => switchTab('songs'));
    setlistsTab.addEventListener('click', () => switchTab('setlists'));
}

// Initialize service worker for PWA
function initServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('service-worker.js').then(registration => {
                console.log('ServiceWorker registration successful');
            }).catch(error => {
                console.log('ServiceWorker registration failed: ', error);
            });
        });
    }
}

// Initialize app
function initApp() {
    // Load data
    loadData();
    
    // Setup event listeners
    setupTabEvents();
    setupSongEvents();
    setupSetlistEvents();
    setupScrollerEvents();
    
    // Initialize service worker
    initServiceWorker();
    
    // Handle orientation changes
    window.addEventListener('orientationchange', () => {
        // Refresh font sizes
        if (currentSongIndex !== null) {
            const song = songs[currentSongIndex];
            lyricsText.style.fontSize = `${song.fontSize}px`;
        }
        
        if (currentGigSetlist && currentGigSongIndex !== null) {
            const songId = currentGigSetlist.songs[currentGigSongIndex];
            const song = getSongById(songId);
            if (song) {
                gigLyricsText.style.fontSize = `${song.fontSize}px`;
            }
        }
    });
}

// Start the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);