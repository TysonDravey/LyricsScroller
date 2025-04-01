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

// Base scroll speed in pixels per second - now with more granularity
const BASE_SCROLL_SPEED = 10; // Reduced base speed for finer control
const MIN_SPEED = 1;
const MAX_SPEED = 20; // Increased range
let currentScrollDelay = 0; // Intro delay in seconds

// Global preferences
let globalFontSize = 18; // Default font size

// Load global preferences
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

// Show gig view and load current song
function showGigView() {
    if (!currentGigSetlist || currentGigSetlist.songs.length === 0) return;
    
    loadGlobalPreferences();
    loadGigSong(currentGigSongIndex);
    
    setlistDetailView.classList.add('hidden');
    gigView.classList.remove('hidden');
    
    updateGigNavigation();
}

// Load song in gig view
function loadGigSong(index) {
    if (!currentGigSetlist || index < 0 || index >= currentGigSetlist.songs.length) return;
    
    stopScrolling();
    
    currentGigSongIndex = index;
    const songId = currentGigSetlist.songs[index];
    const song = getSongById(songId);
    
    if (song) {
        gigSongTitle.textContent = song.title;
        gigLyricsText.textContent = song.lyrics;
        
        // Apply global font size instead of song-specific
        gigLyricsText.style.fontSize = `${globalFontSize}px`;
        
        // Use song-specific scroll speed (default to 5 if not set)
        currentScrollSpeed = song.scrollSpeed || 5;
        
        // Apply song-specific intro delay (default to 0 if not set)
        currentScrollDelay = song.introDelay || 0;
        
        // Display the current speed in the UI
        updateSpeedDisplay();
        
        // Reset scroll position
        gigLyricsScroll.scrollTop = 0;
        
        // Update position indicator
        songPosition.textContent = `${index + 1}/${currentGigSetlist.songs.length}`;
    }
}

// Update the numeric speed display in the UI
function updateSpeedDisplay() {
    // Update the display if a speed display element exists
    const speedDisplay = document.getElementById('current-speed-value');
    if (speedDisplay) {
        speedDisplay.textContent = currentScrollSpeed;
    }
    
    // Update the delay display if it exists
    const delayDisplay = document.getElementById('current-delay-value');
    if (delayDisplay) {
        delayDisplay.textContent = currentScrollDelay;
    }
}

// Update navigation status (called for swipe navigation)
function updateGigNavigation() {
    // Since buttons are removed, this just updates any UI that reflects position
    songPosition.textContent = `${currentGigSongIndex + 1}/${currentGigSetlist.songs.length}`;
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
    console.log('startGigScrolling function called');
    if (isScrolling) return;
    
    isScrolling = true;
    gigScrollBtn.classList.add('hidden');
    scrollControls.classList.remove('hidden');
    
    // Calculate scroll parameters
    const scrollHeight = gigLyricsScroll.scrollHeight - gigLyricsScroll.clientHeight;
    
    let lastTimestamp = null;
    let delayTimeRemaining = currentScrollDelay * 1000; // Convert to milliseconds
    
    // Show countdown if there's a delay
    const countdownDisplay = document.getElementById('delay-countdown');
    if (countdownDisplay && delayTimeRemaining > 0) {
        countdownDisplay.textContent = Math.ceil(delayTimeRemaining / 1000);
        countdownDisplay.classList.remove('hidden');
    }
    
    function animateScroll(timestamp) {
        if (!isScrolling) return;
        
        if (!lastTimestamp) {
            lastTimestamp = timestamp;
        }
        
        const elapsed = timestamp - lastTimestamp;
        lastTimestamp = timestamp;
        
        // Handle intro delay
        if (delayTimeRemaining > 0) {
            delayTimeRemaining -= elapsed;
            
            // Update countdown display
            if (countdownDisplay) {
                countdownDisplay.textContent = Math.ceil(delayTimeRemaining / 1000);
            }
            
            // Continue waiting if delay not finished
            if (delayTimeRemaining > 0) {
                scrollAnimationId = requestAnimationFrame(animateScroll);
                return;
            } else {
                // Hide countdown when done
                if (countdownDisplay) {
                    countdownDisplay.classList.add('hidden');
                }
            }
        }
        
        // Calculate pixels to scroll based on current speed
        const pixelsPerSecond = BASE_SCROLL_SPEED * currentScrollSpeed;
        const pixelsToScroll = (elapsed / 1000) * pixelsPerSecond;
        
        gigLyricsScroll.scrollTop += pixelsToScroll;
        
        // Continue scrolling if not at the end
        if (gigLyricsScroll.scrollTop < scrollHeight) {
            scrollAnimationId = requestAnimationFrame(animateScroll);
        } else {
            stopScrolling();
        }
    }
    
    scrollAnimationId = requestAnimationFrame(animateScroll);
}

// Stop scrolling
function stopScrolling() {
    isScrolling = false;
    
    if (scrollAnimationId) {
        cancelAnimationFrame(scrollAnimationId);
        scrollAnimationId = null;
    }
    
    // Hide countdown if visible
    const countdownDisplay = document.getElementById('delay-countdown');
    if (countdownDisplay) {
        countdownDisplay.classList.add('hidden');
    }
    
    // Reset UI
    gigScrollBtn.classList.remove('hidden');
    scrollControls.classList.add('hidden');
}

// Adjust scrolling speed
function adjustScrollSpeed(delta) {
    currentScrollSpeed = Math.max(MIN_SPEED, Math.min(MAX_SPEED, currentScrollSpeed + delta));
    console.log(`Scroll speed adjusted to: ${currentScrollSpeed}`);
    
    // Update speed display
    updateSpeedDisplay();
    
    // Save the speed to the song
    const songId = currentGigSetlist.songs[currentGigSongIndex];
    const songIndex = songs.findIndex(s => s.id === songId);
    if (songIndex >= 0) {
        songs[songIndex].scrollSpeed = currentScrollSpeed;
        saveData();
    }
}

// Adjust intro delay
function adjustIntroDelay(delta) {
    currentScrollDelay = Math.max(0, currentScrollDelay + delta);
    console.log(`Intro delay adjusted to: ${currentScrollDelay} seconds`);
    
    // Update delay display
    updateSpeedDisplay();
    
    // Save the delay to the song
    const songId = currentGigSetlist.songs[currentGigSongIndex];
    const songIndex = songs.findIndex(s => s.id === songId);
    if (songIndex >= 0) {
        songs[songIndex].introDelay = currentScrollDelay;
        saveData();
    }
}

// Exit gig mode
function exitGig() {
    stopScrolling();
    showSetlistDetail(currentSetlistIndex);
}

// Update the UI to show the new controls
function createGigUI() {
    // Add speed display and intro delay to the scroll controls
    const controlsContainer = document.getElementById('scroll-controls');
    if (!controlsContainer) return;
    
    // Clear existing content
    controlsContainer.innerHTML = '';
    
    // Create speed controls
    const speedControls = document.createElement('div');
    speedControls.className = 'speed-controls control-group';
    speedControls.innerHTML = `
        <div class="control-label">Scroll Speed: <span id="current-speed-value">${currentScrollSpeed}</span></div>
        <div class="control-buttons">
            <button id="scroll-slower-btn" class="btn btn-warning">-</button>
            <button id="scroll-stop-btn" class="btn btn-danger">Stop</button>
            <button id="scroll-faster-btn" class="btn btn-warning">+</button>
        </div>
    `;
    
    // Create delay controls
    const delayControls = document.createElement('div');
    delayControls.className = 'delay-controls control-group';
    delayControls.innerHTML = `
        <div class="control-label">Intro Delay: <span id="current-delay-value">${currentScrollDelay}</span>s</div>
        <div class="control-buttons">
            <button id="delay-shorter-btn" class="btn btn-warning">-</button>
            <button id="delay-longer-btn" class="btn btn-warning">+</button>
        </div>
    `;
    
    // Add countdown display
    const countdownDisplay = document.createElement('div');
    countdownDisplay.id = 'delay-countdown';
    countdownDisplay.className = 'countdown-display hidden';
    countdownDisplay.textContent = '0';
    
    // Add everything to the controls container
    controlsContainer.appendChild(speedControls);
    controlsContainer.appendChild(delayControls);
    controlsContainer.appendChild(countdownDisplay);
    
    // Setup event listeners for the new buttons
    document.getElementById('scroll-slower-btn').addEventListener('click', () => adjustScrollSpeed(-1));
    document.getElementById('scroll-stop-btn').addEventListener('click', stopScrolling);
    document.getElementById('scroll-faster-btn').addEventListener('click', () => adjustScrollSpeed(1));
    document.getElementById('delay-shorter-btn').addEventListener('click', () => adjustIntroDelay(-1));
    document.getElementById('delay-longer-btn').addEventListener('click', () => adjustIntroDelay(1));
    
    // Add additional styles to the page
    const style = document.createElement('style');
    style.textContent = `
        .control-group {
            margin-bottom: 15px;
        }
        .control-label {
            margin-bottom: 5px;
            font-weight: bold;
        }
        .control-buttons {
            display: flex;
            justify-content: center;
            gap: 10px;
        }
        .countdown-display {
            font-size: 2rem;
            font-weight: bold;
            text-align: center;
            margin-top: 10px;
            color: #e74c3c;
        }
    `;
    document.head.appendChild(style);
    
    // Remove the navigation buttons from the UI
    const navControls = document.querySelector('.nav-controls');
    if (navControls) {
        navControls.remove();
    }
}

// Setup gig navigation events
function setupScrollerEvents() {
    // Create the new UI
    createGigUI();
    
    // Gig navigation
    exitGigBtn.addEventListener('click', exitGig);
    gigScrollBtn.addEventListener('click', startGigScrolling);
    
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
            goToNextSong();
        } else if (touchEndX - touchStartX > swipeThreshold) {
            // Swiped right, go to previous song
            goToPreviousSong();
        }
    });
}

// Add font size settings to the app
function addFontSizeSettings() {
    // Add font size control to the app settings
    const settingsContainer = document.createElement('div');
    settingsContainer.className = 'settings-container';
    settingsContainer.innerHTML = `
        <h3>Global Settings</h3>
        <div class="form-group">
            <label for="global-font-size" class="control-label">Font Size: <span id="global-font-size-value">${globalFontSize}</span>pt</label>
            <input type="range" id="global-font-size" class="slider" min="12" max="36" value="${globalFontSize}">
        </div>
    `;
    
    // Add the settings to the main view
    const mainView = document.getElementById('main-view');
    mainView.appendChild(settingsContainer);
    
    // Setup event listener for font size change
    const fontSizeSlider = document.getElementById('global-font-size');
    fontSizeSlider.addEventListener('input', function() {
        globalFontSize = parseInt(this.value);
        document.getElementById('global-font-size-value').textContent = globalFontSize;
        saveGlobalPreferences();
    });
}

// Initialize scroller events when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadGlobalPreferences();
    setupScrollerEvents();
    addFontSizeSettings();
    console.log('Scroller events have been set up.');
});

console.log('scroller.js loaded successfully.');