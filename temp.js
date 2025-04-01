/* Add these styles to your styles.css file */

/* Hide the previous/next buttons */
.nav-controls {
    display: none !important;
}

/* Fix scrolling button position */
.btn-bar {
    position: fixed;
    bottom: 20px;
    left: 0;
    right: 0;
    text-align: center;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 10px;
    box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
    z-index: 100;
}

/* Make sure the lyrics container doesn't go behind the button */
.lyrics-container {
    padding-bottom: 70px; /* Space for the fixed button */
}

/* Scrolling controls */
.scroll-controls {
    margin-top: 15px;
    padding: 15px;
    border-top: 1px solid #ddd;
    background-color: rgba(255, 255, 255, 0.9);
    position: fixed;
    bottom: 70px;
    left: 0;
    right: 0;
    z-index: 99;
}

/* Font size control */
.font-size-control {
    padding: 15px;
    margin-top: 20px;
    border-top: 1px solid #ccc;
}

.control-row {
    margin-bottom: 15px;
}

.control-label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
}

/* Touch-friendly sliders */
input[type="range"].slider {
    width: 100%;
    height: 30px;
    -webkit-appearance: none;
    background: #ddd;
    border-radius: 15px;
    outline: none;
}

input[type="range"].slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 30px;
    height: 30px;
    background: #3498db;
    border-radius: 50%;
    cursor: pointer;
}

/* Swipe hint */
.swipe-hint {
    text-align: center;
    color: #777;
    font-size: 0.8rem;
    padding: 10px;
    font-style: italic;
}

/* Better visibility for the current position indicator */
#song-position {
    background-color: #f39c12;
    color: white;
    padding: 3px 8px;
    border-radius: 10px;
    font-weight: bold;
}