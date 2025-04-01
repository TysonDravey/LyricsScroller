// Add this to your app.js file if it doesn't already have something similar

// DOM Elements - Main Navigation
const mainView = document.getElementById('main-view');
const songsTab = document.getElementById('songs-tab');
const setlistsTab = document.getElementById('setlists-tab');
const songsContent = document.getElementById('songs-content');
const setlistsContent = document.getElementById('setlists-content');

// Initialize the application
function initApp() {
    // Load data first
    loadData();
    
    // Setup UI events
    setupSongEvents();
    setupSetlistEvents();
    setupTabEvents();
    
    // Additional setup
    console.log('App initialized successfully');
}

// Setup tab navigation
function setupTabEvents() {
    songsTab.addEventListener('click', () => {
        songsTab.classList.add('active');
        setlistsTab.classList.remove('active');
        songsContent.classList.remove('hidden');
        setlistsContent.classList.add('hidden');
    });
    
    setlistsTab.addEventListener('click', () => {
        setlistsTab.classList.add('active');
        songsTab.classList.remove('active');
        setlistsContent.classList.remove('hidden');
        songsContent.classList.add('hidden');
    });
}

// Return to main view
function showMainView() {
    songDetailView.classList.add('hidden');
    songEditView.classList.add('hidden');
    setlistDetailView.classList.add('hidden');
    setlistEditView.classList.add('hidden');
    gigView.classList.add('hidden');
    mainView.classList.remove('hidden');
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});