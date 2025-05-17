import { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import VideoInfo from './components/VideoInfo';
import DownloadOptions from './components/DownloadOptions';
import { API_URL } from './constants';

const App = () => {
  const [url, setUrl] = useState('');
  const [videoData, setVideoData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchVideoInfo = async () => {
    if (!url.trim()) {
      toast.error('Please enter a YouTube URL');
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/info`, { params: { url } });
      setVideoData(response.data);
    } catch (error) {
      toast.error('Failed to fetch video info. Please check the URL.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (format, quality = null) => {
    if (!videoData) return;

    try {
      setIsLoading(true);
      const params = { url, format };
      if (format === 'mp4') params.quality = quality;

      // Create download URL and open in new tab
      const downloadUrl = `${API_URL}/download?${new URLSearchParams(params)}`;
      window.open(downloadUrl, '_blank');
      
      toast.success(`Starting ${format} download (${quality || 'audio'})...`);
    } catch (error) {
      toast.error('Download failed. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Paste YouTube URL</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark bg-white dark:bg-gray-700"
              />
              <button
                onClick={fetchVideoInfo}
                disabled={isLoading}
                className="bg-primary-light dark:bg-primary-dark text-white px-6 py-3 rounded hover:bg-opacity-90 disabled:opacity-50"
              >
                {isLoading ? 'Loading...' : 'Get Info'}
              </button>
            </div>
          </div>

          <VideoInfo videoData={videoData} isLoading={isLoading} />
          {videoData && (
            <DownloadOptions 
              videoData={videoData} 
              onDownload={handleDownload} 
              isLoading={isLoading} 
            />
          )}
        </div>
      </main>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default App;