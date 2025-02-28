// Sample song data
const initialSongs = [
    {
        id: '1',
        title: 'Sample Song',
        lyrics: `This is the first verse of your song.
These are placeholder lyrics for demonstration.
You'll replace these with your actual lyrics.
This is where your chorus would go.

This is the second verse of your song.
Continue with more placeholder text here.
Another line for your performance.
Back to the chorus section again.

And here's another verse so you can see scrolling in action
Line after line of lyrics will move up the screen
As the song progresses through each section
You can adjust the scroll speed for each particular song`,
        scrollSpeed: 5,
        fontSize: 18
    }
];

// Sample setlist data
const initialSetlists = [
    {
        id: '1',
        name: 'Sample Gig',
        songs: ['1']
    }
];

// Application state
let songs = [];
let setlists = [];
let currentSongIndex = null;
let currentSetlistIndex = null;
let currentGigSetlist = null;
let currentGigSongIndex = 0;
let isScrolling = false;
let scrollAnimationId = null;
let editingIndex = null;
let editingSetlistIndex = null;
let currentScrollSpeed = 5;

// Load data from local storage
function loadData() {
    const storedSongs = localStorage.getItem('gig-lyrics-songs');
    const storedSetlists = localStorage.getItem('gig-lyrics-setlists');
    
    if (storedSongs) {
        songs = JSON.parse(storedSongs);
    } else {
        songs = initialSongs;
        saveData();
    }
    
    if (storedSetlists) {
        setlists = JSON.parse(storedSetlists);
    } else {
        setlists = initialSetlists;
        saveData();
    }
    
    renderSongList();
    renderSetlistsList();
}

// Save all data to local storage
function saveData() {
    localStorage.setItem('gig-lyrics-songs', JSON.stringify(songs));
    localStorage.setItem('gig-lyrics-setlists', JSON.stringify(setlists));
}

// Helper function to get song by id
function getSongById(id) {
    return songs.find(song => song.id === id);
}