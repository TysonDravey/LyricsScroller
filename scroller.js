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

// Base scroll speed in pixels per second
const BASE_SCROLL_SPEED = 30;
let currentScrollSpeed = 5; // Multiplier for base speed
let isScrolling = false;
let scrollAnimationId = null;

// Show gig view and load current song
function showGigView() {
    if (!currentGigSetlist || currentGigSetlist.songs.length === 0) return;
    
    loadGigSong(currentGigSongIndex);
    
    setlistDetailView.classList.add('hidden');
    gigView.classList.remove('hidden');
    
    // Make sure buttons are properly set up when view is shown
    setupScrollListeners();
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
        
        // Set the font size - use song-specific if available or default to 18
        const fontSize = song.fontSize || 18;
        gigLyricsText.style.fontSize = `${fontSize}px`;
        
        // Get song-specific scroll speed if available
        currentScrollSpeed = song.scrollSpeed || 5;
        
        // Reset scroll position
        gigLyricsScroll.scrollTop = 0;
        
        // Update position indicator
        songPosition.textContent = `${index + 1}/${currentGigSetlist.songs.length}`;
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

// Set up listeners for scrolling controls - called every time gig view is shown
function setupScrollListeners() {
    // Start scrolling button
    if (gigScrollBtn) {
        // Remove existing listeners
        const newButton = gigScrollBtn.cloneNode(true);
        gigScrollBtn.parentNode.replaceChild(newButton, gigScrollBtn);
        
        // Add fresh listener to the new button
        newButton.addEventListener('click', function() {
            if (!isScrolling) {
                startGigScrolling();
            } else {
                stopScrolling();
            }
        });
    }
    
    // Exit gig button
    if (exitGigBtn) {
        // Remove existing listeners
        const newExitBtn = exitGigBtn.cloneNode(true);
        exitGigBtn.parentNode.replaceChild(newExitBtn, exitGigBtn);
        
        // Add fresh listener
        newExitBtn.addEventListener('click', function() {
            stopScrolling();
            setlistDetailView.classList.remove('hidden');
            gigView.classList.add('hidden');
        });
    }
    
    // Set up swipe detection for song navigation
    gigView.addEventListener('touchstart', handleTouchStart, false);
    gigView.addEventListener('touchend', handleTouchEnd, false);
}

// Touch handlers for swiping
let xDown = null;
function handleTouchStart(evt) {
    xDown = evt.touches[0].clientX;
}

function handleTouchEnd(evt) {
    if (!xDown) return;
    
    const xUp = evt.changedTouches[0].clientX;
    const xDiff = xDown - xUp;
    
    // Detect left/right swipe - threshold of 50 pixels
    if (Math.abs(xDiff) > 50) {
        if (xDiff > 0) {
            // Swiped left - next song
            goToNextSong();
        } else {
            // Swiped right - previous song
            goToPreviousSong();
        }
    }
    
    // Reset touch point
    xDown = null;
}

// Start scrolling lyrics in the gig view
function startGigScrolling() {
    if (isScrolling) return;
    
    isScrolling = true;
    gigScrollBtn.textContent = 'Stop Scrolling';
    
    // Calculate scroll parameters
    const scrollHeight = gigLyricsScroll.scrollHeight - gigLyricsScroll.clientHeight;
    const pixelsPerSecond = BASE_SCROLL_SPEED * (currentScrollSpeed / 10);
    
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
}

// Stop scrolling
function stopScrolling() {
    isScrolling = false;
    
    if (scrollAnimationId) {
        cancelAnimationFrame(scrollAnimationId);
        scrollAnimationId = null;
    }
    
    // Reset UI
    if (gigScrollBtn) {
        gigScrollBtn.textContent = 'Start Scrolling';
    }
}

// Adjust scrolling speed
function adjustScrollSpeed(delta) {
    currentScrollSpeed = Math.max(1, Math.min(10, currentScrollSpeed + delta));
    
    // If we're in the middle of scrolling, we don't need to restart
    // The next animation frame will use the new speed
}

// Exit gig mode
function exitGig() {
    stopScrolling();
    gigView.classList.add('hidden');
    setlistDetailView.classList.remove('hidden');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Setup event listeners when the DOM is loaded
    if (gigScrollBtn) {
        gigScrollBtn.addEventListener('click', function() {
            if (!isScrolling) {
                startGigScrolling();
            } else {
                stopScrolling();
            }
        });
    }
    
    if (exitGigBtn) {
        exitGigBtn.addEventListener('click', exitGig);
    }
    
    // Set up the swipe handlers
    if (gigView) {
        gigView.addEventListener('touchstart', handleTouchStart, false);
        gigView.addEventListener('touchend', handleTouchEnd, false);
    }
    
    // Speed adjustment buttons
    if (scrollSlowerBtn) {
        scrollSlowerBtn.addEventListener('click', function() {
            adjustScrollSpeed(-1);
        });
    }
    
    if (scrollFasterBtn) {
        scrollFasterBtn.addEventListener('click', function() {
            adjustScrollSpeed(1);
        });
    }
    
    if (scrollStopBtn) {
        scrollStopBtn.addEventListener('click', stopScrolling);
    }
});

// Make showGigView available globally
window.showGigView = showGigView;

console.log('scroller.js loaded - Simplified version');