document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('change', function() {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', this.checked);
    });
    
    // Check for saved theme preference
    if (localStorage.getItem('darkMode') === 'true') {
        themeToggle.checked = true;
        document.body.classList.add('dark-mode');
    }
    
    // Tab switching functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Hide all tab contents
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.style.display = 'none';
            });
            
            // Show the selected tab content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).style.display = 'block';
        });
    });
    
    // Fetch video details when button is clicked
    const fetchBtn = document.getElementById('fetch-btn');
    fetchBtn.addEventListener('click', fetchVideoDetails);
    
    // Also fetch when Enter key is pressed in the input field
    const videoUrlInput = document.getElementById('video-url');
    videoUrlInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            fetchVideoDetails();
        }
    });
    
    function fetchVideoDetails() {
        const videoUrl = videoUrlInput.value.trim();
        
        if (!videoUrl) {
            alert('Please enter a YouTube URL');
            return;
        }
        
        // Validate YouTube URL
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
        if (!youtubeRegex.test(videoUrl)) {
            alert('Please enter a valid YouTube URL');
            return;
        }
        
        // Show loading state
        fetchBtn.disabled = true;
        fetchBtn.textContent = 'Fetching...';
        
        // Extract video ID
        const videoId = extractVideoId(videoUrl);
        
        if (!videoId) {
            alert('Could not extract video ID from URL');
            fetchBtn.disabled = false;
            fetchBtn.textContent = 'Fetch Video';
            return;
        }
        
        // Make API call to your backend
        const API_URL = "https://youtube-downloader-3-fihv.onrender.com";
fetch(`${API_URL}/api/video-info?url=${encodeURIComponent(videoUrl)}`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    throw new Error(data.error);
                }
                displayVideoDetails(data, videoId);
            })
            .catch(error => {
                alert('Error fetching video details: ' + error.message);
                console.error('Error:', error);
            })
            .finally(() => {
                fetchBtn.disabled = false;
                fetchBtn.textContent = 'Fetch Video';
            });
    }
    
    function extractVideoId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }
    
    function displayVideoDetails(data, videoId) {
        // Update video details section
        document.getElementById('video-title').textContent = data.title || 'Unknown Title';
        document.getElementById('video-channel').textContent = data.author || 'Unknown Channel';
        document.getElementById('video-views').textContent = data.views ? `${data.views} views` : 'Views not available';
        document.getElementById('duration').textContent = data.duration || '00:00';
        document.getElementById('thumbnail').src = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
        document.getElementById('thumbnail').alt = data.title || 'Video Thumbnail';
        
        // Show the video details section
        document.getElementById('video-details').style.display = 'flex';
        
        // Create quality buttons
        const qualityButtonsContainer = document.getElementById('video-quality-btns');
        qualityButtonsContainer.innerHTML = '';
        
        // Add available video formats
        if (data.formats && data.formats.length > 0) {
            // Sort by quality (highest first)
            const sortedFormats = data.formats.sort((a, b) => {
                const qualityA = parseInt(a.qualityLabel) || 0;
                const qualityB = parseInt(b.qualityLabel) || 0;
                return qualityB - qualityA;
            });
            
            sortedFormats.forEach(format => {
                if (format.hasVideo) {
                    const btn = document.createElement('button');
                    btn.className = 'download-btn';
                    btn.innerHTML = `<i class="fas fa-download"></i> ${format.qualityLabel || format.quality}`;
                    btn.setAttribute('data-quality', format.qualityLabel || format.quality);
                    btn.setAttribute('data-url', format.url);
                    
                    btn.addEventListener('click', function() {
                        downloadFile(format.url, `${data.title || 'video'}_${format.qualityLabel || format.quality}.mp4`);
                    });
                    
                    qualityButtonsContainer.appendChild(btn);
                }
            });
        } else {
            qualityButtonsContainer.innerHTML = '<p>No video formats available</p>';
        }
        
        // Set up MP3 download button
        const mp3Btn = document.querySelector('.mp3-btn');
        mp3Btn.addEventListener('click', function() {
            // Find the best audio format
            const audioFormat = data.formats.find(f => f.hasAudio && !f.hasVideo && f.mimeType.includes('audio/mp4'));
            if (audioFormat) {
                downloadFile(audioFormat.url, `${data.title || 'audio'}.mp3`);
            } else {
                alert('No MP3 format available');
            }
        });
        
        // Show the download options section
        document.getElementById('download-options').style.display = 'block';
    }
    
    function downloadFile(url, filename) {
        // Create a temporary anchor element
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Alternatively, you can use fetch and blob for more control
        /*
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            })
            .catch(error => {
                console.error('Download error:', error);
                alert('Download failed');
            });
        */
    }
});

// Heroku/Render के URL का इस्तेमाल करें
const API_URL = "https://youtube-downloader-3-1kvl.onrender.com"; 

// Fetch call example
fetch(`${API_URL}?url=${videoUrl}`)
  .then(response => response.json())
  .then(data => console.log(data));
