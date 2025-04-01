// Data export and import functionality
const dataExport = {
    // Export all app data to a JSON file
    exportData: function() {
        try {
            // Debug - check what's in localStorage directly
            const storedSongs = localStorage.getItem('gig-lyrics-songs');
            const storedSetlists = localStorage.getItem('gig-lyrics-setlists');
            
            console.log("LocalStorage songs:", storedSongs ? JSON.parse(storedSongs) : "None");
            console.log("LocalStorage setlists:", storedSetlists ? JSON.parse(storedSetlists) : "None");
            
            // Create export object directly from localStorage instead of global variables
            // This ensures we're getting the most up-to-date data
            const exportData = {
                songs: storedSongs ? JSON.parse(storedSongs) : [],
                setlists: storedSetlists ? JSON.parse(storedSetlists) : [],
                version: '1.0',
                exportDate: new Date().toISOString()
            };
            
            // Convert to JSON string
            const jsonData = JSON.stringify(exportData, null, 2);
            
            // Log what we're exporting
            console.log("Exporting data:", exportData);
            
            // Create download link
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            // Create download element
            const a = document.createElement('a');
            a.href = url;
            a.download = `lyrics_scroller_backup_${new Date().toISOString().slice(0,10)}.json`;
            document.body.appendChild(a);
            a.click();
            
            // Cleanup
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
            
            alert('Export successful!');
            return true;
        } catch (error) {
            console.error('Export failed:', error);
            alert('Export failed: ' + error.message);
            return false;
        }
    },
    
    // Import data from a JSON file
    importData: function(file) {
        return new Promise((resolve, reject) => {
            if (!file) {
                reject(new Error('No file selected'));
                return;
            }
            
            const reader = new FileReader();
            
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);
                    console.log("Imported data:", data);
                    
                    // Validate data format
                    if (!data.songs || !Array.isArray(data.songs) || !data.setlists || !Array.isArray(data.setlists)) {
                        reject(new Error('Invalid data format'));
                        return;
                    }
                    
                    // Ask for confirmation before overwriting existing data
                    const storedSongs = localStorage.getItem('gig-lyrics-songs');
                    const storedSetlists = localStorage.getItem('gig-lyrics-setlists');
                    const hasSongs = storedSongs && JSON.parse(storedSongs).length > 0;
                    const hasSetlists = storedSetlists && JSON.parse(storedSetlists).length > 0;
                    
                    if (hasSongs || hasSetlists) {
                        if (!confirm('This will replace your existing songs and setlists. Continue?')) {
                            reject(new Error('Import cancelled by user'));
                            return;
                        }
                    }
                    
                    // Save the imported data directly to localStorage
                    localStorage.setItem('gig-lyrics-songs', JSON.stringify(data.songs));
                    localStorage.setItem('gig-lyrics-setlists', JSON.stringify(data.setlists));
                    
                    // Reload the page to refresh all data
                    alert(`Import successful! Loaded ${data.songs.length} songs and ${data.setlists.length} setlists. The page will now reload.`);
                    window.location.reload();
                    
                    resolve({
                        songs: data.songs.length,
                        setlists: data.setlists.length,
                        importDate: data.exportDate || 'Unknown'
                    });
                } catch (error) {
                    console.error('Import failed:', error);
                    reject(error);
                    alert('Import failed: ' + error.message);
                }
            };
            
            reader.onerror = function() {
                reject(new Error('File read error'));
                alert('File read error. Please try again.');
            };
            
            reader.readAsText(file);
        });
    }
};

// Add export/import UI to the main view
function setupExportImportUI() {
    // Create the container div
    const container = document.createElement('div');
    container.className = 'export-import-container';
    container.style.padding = '15px';
    container.style.marginTop = '20px';
    container.style.borderTop = '1px solid #ccc';
    
    // Create the buttons
    container.innerHTML = `
        <h3>Backup & Restore</h3>
        <div class="export-import-buttons" style="display: flex; gap: 10px; margin-top: 10px;">
            <button id="export-btn" class="btn btn-primary">Export Data</button>
            <div style="position: relative;">
                <button id="import-btn" class="btn btn-primary">Import Data</button>
                <input type="file" id="import-file" accept=".json" style="position: absolute; top: 0; left: 0; opacity: 0; width: 100%; height: 100%; cursor: pointer;">
            </div>
        </div>
    `;
    
    // Add to the main view
    const mainView = document.getElementById('main-view');
    if (mainView) {
        mainView.appendChild(container);
        
        // Set up event listeners
        document.getElementById('export-btn').addEventListener('click', dataExport.exportData);
        
        document.getElementById('import-file').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                dataExport.importData(file).catch(error => {
                    console.error('Import error:', error);
                });
            }
        });
    } else {
        console.error("Main view element not found. Export/Import UI not added.");
    }
}

// Initialize export/import when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit to ensure the main app is initialized first
    setTimeout(() => {
        setupExportImportUI();
        console.log('Export/Import functionality initialized.');
    }, 1000);
});

// Add this to the beginning of your exportData function
let debugInfo = "";
debugInfo += "Checking localStorage...\n";

const storedSongs = localStorage.getItem('gig-lyrics-songs');
const storedSetlists = localStorage.getItem('gig-lyrics-setlists');

debugInfo += "Songs in storage: " + (storedSongs ? JSON.parse(storedSongs).length : "None") + "\n";
debugInfo += "Setlists in storage: " + (storedSetlists ? JSON.parse(storedSetlists).length : "None") + "\n";

// Create a debug element on the page
const debugDiv = document.createElement('div');
debugDiv.style.padding = '10px';
debugDiv.style.margin = '10px';
debugDiv.style.border = '1px solid red';
debugDiv.style.backgroundColor = '#ffe0e0';
debugDiv.style.whiteSpace = 'pre-wrap';
debugDiv.textContent = debugInfo;

// Add it to the page
document.body.appendChild(debugDiv);