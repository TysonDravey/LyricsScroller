// DOM Elements - Gig View
const gigView = document.getElementById('gig-view');
const exitGigBtn = document.getElementById('exit-gig-btn');
const gigSongTitle = document.getElementById('gig-song-title');
const gigLyricsText = document.getElementById('gig-lyrics-text');
const gigLyricsScroll = document.getElementById('gig-lyrics-scroll');
const songPosition = document.getElementById('song-position');
const prevSongBtn = document.getElementById('prev-song-btn');
const nextSongBtn = document.getElementById('next-song-btn');
const gigScrollBtn = document.getElementById('gig-scroll-btn');
const scrollControls = document.getElementById('scroll-controls');
const scrollSlowerBtn = document.getElementById('scroll-slower-btn');
const scrollStopBtn = document.getElementById('scroll-stop-btn');
const scrollFasterBtn = document.getElementById('scroll-faster-btn');

// Base scroll speed in pixels per second
const BASE_SCROLL_SPEED = 30;
// Note: we're now using the global variables defined in data.js:
// isScrolling, scrollAnimationId, currentScrollSpeed

// Show gig view and load current song
function showGigView() {
    if (!currentGigSetlist || currentGigSetlist.songs.length === 0) return;
    
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
        gigLyricsText.style.fontSize = `${song.fontSize || 18}px`; // Default to 18px if not set
        currentScrollSpeed = song.scrollSpeed || 5;
        
        // Reset scroll position
        gigLyricsScroll.scrollTop = 0;
        
        // Update position indicator
        songPosition.textContent = `${index + 1}/${currentGigSetlist.songs.length}`;
        
        updateGigNavigation();
    }
}

// Update next/previous navigation buttons
function updateGigNavigation() {
    prevSongBtn.disabled = currentGigSongIndex <= 0;
    nextSongBtn.disabled = currentGigSongIndex >= currentGigSetlist.songs.length - 1;
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
    const pixelsPerSecond = BASE_SCROLL_SPEED * currentScrollSpeed;
    
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
    gigScrollBtn.classList.remove('hidden');
    scrollControls.classList.add('hidden');
}

// Adjust scrolling speed
function adjustScrollSpeed(delta) {
    currentScrollSpeed = Math.max(1, Math.min(10, currentScrollSpeed + delta));
    console.log(`Scroll speed adjusted to: ${currentScrollSpeed}`);
    // If we're in the middle of scrolling, we don't need to restart
    // The next animation frame will use the new speed
}

// Exit gig mode
function exitGig() {
    stopScrolling();
    showSetlistDetail(currentSetlistIndex);
}

// Setup gig navigation events
function setupScrollerEvents() {
    // Gig navigation
    exitGigBtn.addEventListener('click', exitGig);
    prevSongBtn.addEventListener('click', goToPreviousSong);
    nextSongBtn.addEventListener('click', goToNextSong);
    gigScrollBtn.addEventListener('click', startGigScrolling);
    
    // Scroll controls
    scrollSlowerBtn.addEventListener('click', () => adjustScrollSpeed(-1));
    scrollStopBtn.addEventListener('click', stopScrolling);
    scrollFasterBtn.addEventListener('click', () => adjustScrollSpeed(1));
    
    // Allow user to scroll manually when auto-scrolling is active
    gigLyricsScroll.addEventListener('touchstart', function() {
        // Keep scrolling enabled during auto-scroll
        if (isScrolling) {
            this.style.overflowY = 'auto';
        }
    });
    
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

// Initialize scroller events when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupScrollerEvents();
    console.log('Scroller events have been set up.');
});

console.log('scroller.js loaded successfully.');