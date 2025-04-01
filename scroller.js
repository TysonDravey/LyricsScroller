// DOM Elements - Gig View
const gigView = document.getElementById('gig-view');
const exitGigBtn = document.getElementById('exit-gig-btn');
const gigSongTitle = document.getElementById('gig-song-title');
const gigLyricsText = document.getElementById('gig-lyrics-text');
const gigLyricsScroll = document.getElementById('gig-lyrics-scroll');
const songPosition = document.getElementById('song-position');
const gigScrollBtn = document.getElementById('gig-scroll-btn');
const scrollControls = document.getElementById('scroll-controls');
const scrollSlowerBtn = document.getElementById('scroll-slower-btn');
const scrollStopBtn = document.getElementById('scroll-stop-btn');
const scrollFasterBtn = document.getElementById('scroll-faster-btn');

// Base scroll speed and control variables
const BASE_SCROLL_SPEED = 30;
let currentScrollSpeed = 5; // Multiplier for base speed
let isScrolling = false;
let scrollAnimationId = null;
let globalFontSize = 18; // Default font size for all songs

// Load global preferences if they exist
function loadGlobalPreferences() {
    const storedPrefs = localStorage.getItem('gig-lyrics-preferences');
    if (storedPrefs) {
        const prefs = JSON.parse(storedPrefs);
        globalFontSize = prefs.fontSize || 18;
    }
}

// Save global preferences
function saveGlobalPreferences() {
    const prefs = {
        fontSize: globalFontSize
    };
    localStorage.setItem('gig-lyrics-preferences', JSON.stringify(prefs));
}

// Initialize scroller when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing scroller...');
    loadGlobalPreferences();
    setupScrollerEvents();
    hideNavButtons();
    
    // Add global font size control to main view if it doesn't exist
    if (!document.getElementById('global-font-size')) {
        addGlobalFontSizeControl();
    }
});

// Hide the previous/next buttons
function hideNavButtons() {
    const navControls = document.querySelector('.nav-controls');
    if (navControls) {
        navControls.style.display = 'none';
        console.log('Navigation buttons hidden');
    }
}

// Add global font size control to main view
function addGlobalFontSizeControl() {
    const mainView = document.getElementById('main-view');
    if (!mainView) return;
    
    const container = document.createElement('div');
    container.className = 'font-size-control';
    container.style.padding = '15px';
    container.style.marginTop = '20px';
    container.style.borderTop = '1px solid #ccc';
    
    container.innerHTML = `
        <h3>Display Settings</h3>
        <div class="control-row">
            <label for="global-font-size" class="control-label">Font Size: <span id="font-size-display">${globalFontSize}</span>pt</label>
            <input type="range" id="global-font-size" class="slider" min="12" max="36" value="${globalFontSize}">
        </div>
    `;
    
    mainView.appendChild(container);
    
    // Set up font size slider
    const fontSizeSlider = document.getElementById('global-font-size');
    if (fontSizeSlider) {
        fontSizeSlider.addEventListener('input', function() {
            globalFontSize = parseInt(this.value);
            document.getElementById('font-size-display').textContent = globalFontSize;
            saveGlobalPreferences();
        });
    }
}

// Show gig view and load current song
function showGigView() {
    console.log('showGigView called');
    
    if (!currentGigSetlist || currentGigSetlist.songs.length === 0) {
        console.error('No setlist or empty setlist');
        return;
    }
    
    // Load the first song
    loadGigSong(currentGigSongIndex);
    
    // Hide setlist view, show gig view
    setlistDetailView.classList.add('hidden');
    gigView.classList.remove('hidden');
    
    // Ensure navigation buttons are hidden
    hideNavButtons();
    
    // Fix scrolling button position
    fixScrollButtonPosition();
    
    console.log('Gig view displayed');
}

// Fix the position of the scrolling button
function fixScrollButtonPosition() {
    const btnBar = document.querySelector('.btn-bar');
    if (btnBar) {
        btnBar.style.position = 'fixed';
        btnBar.style.bottom = '20px';
        btnBar.style.left = '0';
        btnBar.style.right = '0';
        btnBar.style.textAlign = 'center';
        btnBar.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        btnBar.style.padding = '10px';
        btnBar.style.boxShadow = '0 -2px 10px rgba(0,0,0,0.1)';
        btnBar.style.zIndex = '100';
    }
    
    const lyricsContainer = document.querySelector('.lyrics-container');
    if (lyricsContainer) {
        lyricsContainer.style.paddingBottom = '70px';
    }
}

// Load song in gig view
function loadGigSong(index) {
    console.log(`Loading gig song at index: ${index}`);
    
    if (!currentGigSetlist || index < 0 || index >= currentGigSetlist.songs.length) {
        console.error('Invalid song index or no setlist');
        return;
    }
    
    // Stop any active scrolling
    stopScrolling();
    
    // Update the current index
    currentGigSongIndex = index;
    
    // Get the song
    const songId = currentGigSetlist.songs[index];
    const song = getSongById(songId);
    
    if (song) {
        // Update UI with song info
        gigSongTitle.textContent = song.title;
        gigLyricsText.textContent = song.lyrics;
        
        // Apply global font size
        gigLyricsText.style.fontSize = `${globalFontSize}px`;
        
        // Get song-specific scroll speed if available
        currentScrollSpeed = song.scrollSpeed || 5;
        
        // Reset scroll position
        gigLyricsScroll.scrollTop = 0;
        
        // Update position indicator
        songPosition.textContent = `${index + 1}/${currentGigSetlist.songs.length}`;
        
        console.log(`Loaded song: ${song.title}`);
    } else {
        console.error(`Song not found with ID: ${songId}`);
    }
}

// Navigate to previous song
function goToPreviousSong() {
    if (currentGigSongIndex > 0) {
        loadGigSong(currentGigSongIndex - 1);
    }
}

// Navigate to next song
function goToNextSong() {
    if (currentGigSongIndex < currentGigSetlist.songs.length - 1) {
        loadGigSong(currentGigSongIndex + 1);
    }
}

// Start scrolling lyrics in the gig view
function startGigScrolling() {
    console.log('Start gig scrolling called');
    
    if (isScrolling) {
        console.log('Already scrolling, ignoring call');
        return;
    }
    
    isScrolling = true;
    
    // Update UI
    gigScrollBtn.textContent = 'Stop Scrolling';
    scrollControls.classList.remove('hidden');
    
    // Calculate scroll parameters
    const scrollHeight = gigLyricsScroll.scrollHeight - gigLyricsScroll.clientHeight;
    const pixelsPerSecond = BASE_SCROLL_SPEED * currentScrollSpeed / 10; // Adjusted for smoother scrolling
    
    let lastTimestamp = null;
    
    function animateScroll(timestamp) {
        if (!isScrolling) return;
        
        if (!lastTimestamp) {
            lastTimestamp = timestamp;
        }
        
        const elapsed = timestamp - lastTimestamp;
        const pixelsToScroll = (elapsed / 1000) * pixelsPerSecond;
        
        gigLyricsScroll.scrollTop += pixelsToScroll;
        
        lastTimestamp = timestamp;
        
        // Continue scrolling if not at the end
        if (gigLyricsScroll.scrollTop < scrollHeight) {
            scrollAnimationId = requestAnimationFrame(animateScroll);
        } else {
            stopScrolling();
        }
    }
    
    scrollAnimationId = requestAnimationFrame(animateScroll);
    console.log('Scrolling started');
}

// Stop scrolling
function stopScrolling() {
    if (!isScrolling) return;
    
    console.log('Stopping scrolling');
    isScrolling = false;
    
    if (scrollAnimationId) {
        cancelAnimationFrame(scrollAnimationId);
        scrollAnimationId = null;
    }
    
    // Reset UI
    gigScrollBtn.textContent = 'Start Scrolling';
    scrollControls.classList.add('hidden');
}

// Adjust scrolling speed
function adjustScrollSpeed(delta) {
    // Change speed immediately even if scrolling
    currentScrollSpeed = Math.max(1, Math.min(10, currentScrollSpeed + delta));
    console.log(`Scroll speed adjusted to: ${currentScrollSpeed}`);
    
    // Save the speed to the current song
    if (currentGigSetlist && currentGigSongIndex !== null) {
        const songId = currentGigSetlist.songs[currentGigSongIndex];
        const songIndex = songs.findIndex(s => s.id === songId);
        if (songIndex >= 0) {
            songs[songIndex].scrollSpeed = currentScrollSpeed;
            saveData(); // Make sure this function exists in your code
            console.log(`Saved scroll speed ${currentScrollSpeed} for song ${songs[songIndex].title}`);
        }
    }
}

// Exit gig mode
function exitGig() {
    console.log('Exiting gig mode');
    stopScrolling();
    showSetlistDetail(currentSetlistIndex);
}

// Setup gig navigation events
function setupScrollerEvents() {
    console.log('Setting up scroller events');
    
    // Ensure the button has the correct event listener
    if (gigScrollBtn) {
        // Remove any existing listeners
        gigScrollBtn.replaceWith(gigScrollBtn.cloneNode(true));
        // Get the fresh element
        const freshButton = document.getElementById('gig-scroll-btn');
        
        if (freshButton) {
            freshButton.addEventListener('click', function() {
                console.log('Scroll button clicked');
                if (!isScrolling) {
                    startGigScrolling();
                } else {
                    stopScrolling();
                }
            });
            console.log('Added event listener to gig scroll button');
        } else {
            console.error('Could not find gig scroll button after cloning');
        }
    } else {
        console.error('Gig scroll button not found');
    }
    
    // Gig navigation
    if (exitGigBtn) {
        exitGigBtn.addEventListener('click', exitGig);
        console.log('Added event listener to exit button');
    }
    
    // Scroll controls
    if (scrollSlowerBtn) {
        scrollSlowerBtn.addEventListener('click', () => adjustScrollSpeed(-1));
    }
    
    if (scrollStopBtn) {
        scrollStopBtn.addEventListener('click', stopScrolling);
    }
    
    if (scrollFasterBtn) {
        scrollFasterBtn.addEventListener('click', () => adjustScrollSpeed(1));
    }
    
    // Handle swipe for next/previous songs
    let touchStartX = 0;
    
    gigView.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    gigView.addEventListener('touchend', e => {
        const touchEndX = e.changedTouches[0].screenX;
        const swipeThreshold = 100;
        
        if (touchStartX - touchEndX > swipeThreshold) {
            // Swiped left, go to next song
            console.log('Swiped left, going to next song');
            goToNextSong();
        } else if (touchEndX - touchStartX > swipeThreshold) {
            // Swiped right, go to previous song
            console.log('Swiped right, going to previous song');
            goToPreviousSong();
        }
    });
    
    console.log('Scroller events setup complete');
}

// This makes sure the function is globally available
window.showGigView = showGigView;
console.log('scroller.js loaded successfully, showGigView is now global');