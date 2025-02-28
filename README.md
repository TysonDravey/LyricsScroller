# Gig Lyrics Scroller

A web-based lyrics scroller app for musicians, designed to be hosted on GitHub Pages.

## Features

- **Song Management**: Create, edit, and organize your lyrics
- **Setlists**: Create custom setlists for different gigs, with drag-and-drop reordering
- **Custom Scrolling**: Manual or auto-scrolling with adjustable speeds
- **Performance Mode**: Fullscreen mode with scroll speed controls during performance
- **Responsive Design**: Works on phones, tablets, and desktop browsers
- **PWA Support**: Can be installed as an app on your home screen
- **Offline Capability**: Works without an internet connection once loaded
- **Persistent Storage**: All your songs and setlists are saved between sessions

## File Structure

- `index.html` - Main HTML structure
- `styles.css` - All CSS styles
- `app.js` - Main application initialization
- `data.js` - Data management and storage functions
- `songs.js` - Song management functionality
- `setlists.js` - Setlist management functionality
- `scroller.js` - Scrolling and performance mode functionality
- `service-worker.js` - Offline capabilities
- `manifest.json` - PWA configuration

## How to Use

### Managing Songs

1. On the "Songs" tab, tap "Add Song" to create a new song
2. Enter a title and your lyrics
3. Tap "Save" to add it to your collection
4. Tap on any song to view it, or use the edit/delete buttons

### Creating Setlists

1. On the "Setlists" tab, tap "New Setlist"
2. Enter a name for your setlist
3. Add songs by tapping the "Add" button next to each song
4. Reorder songs by dragging the handle on the left
5. Tap "Save" to create your setlist

### Performing with a Setlist

1. Select a setlist from the list
2. Tap "Start Gig" to enter performance mode
3. Navigate between songs using the Previous/Next buttons or swiping
4. Tap "Start Scrolling" to begin auto-scrolling
5. While scrolling, use the on-screen controls to adjust speed or stop
6. You can also manually scroll at any time, even during auto-scroll

## Customization

- **Scroll Speed**: Adjust per song or during performance
- **Font Size**: Customize for better readability
- **Appearance**: Automatically adapts to light/dark mode based on device settings

## Hosting on GitHub Pages

1. Fork or clone this repository
2. Go to your repository settings
3. Under "GitHub Pages", select the main branch
4. Your lyrics scroller will be available at `https://yourusername.github.io/repository-name/`

## Development

To modify or extend this app:

1. Clone the repository
2. Make changes to the relevant files
3. Test locally by opening `index.html` in a browser
4. Commit and push changes to deploy to GitHub Pages

## License

This project is released under the MIT License.