<!-- Update this section in your index.html -->

<!-- Gig Performance View -->
<div id="gig-view" class="container hidden">
    <header>
        <a href="#" id="exit-gig-btn" class="back-link">Exit Gig</a>
        <h1 id="gig-song-title">Song Title</h1>
        <span id="song-position">1/10</span>
    </header>
    
    <!-- The navigation buttons div will be removed by the JS -->
    <div class="nav-controls">
        <button id="prev-song-btn" class="btn btn-primary">← Previous</button>
        <button id="next-song-btn" class="btn btn-primary">Next →</button>
    </div>
    
    <div class="lyrics-container">
        <div id="gig-lyrics-scroll" class="lyrics-scroll">
            <pre id="gig-lyrics-text" class="lyrics"></pre>
        </div>
    </div>

    <div class="btn-bar">
        <button id="gig-scroll-btn" class="btn btn-success">Start Scrolling</button>
    </div>

    <div id="scroll-controls" class="scroll-controls hidden">
        <!-- This will be populated by JavaScript -->
    </div>
</div>