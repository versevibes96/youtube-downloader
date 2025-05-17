import { QUALITY_OPTIONS } from '../constants';

const DownloadOptions = ({ videoData, onDownload, isLoading }) => {
  if (!videoData) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 w-full max-w-2xl mx-auto mt-6">
      <h3 className="text-lg font-semibold mb-4">Download Options</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* MP4 Download Options */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h4 className="font-medium mb-3">Video (MP4)</h4>
          <div className="space-y-2">
            {QUALITY_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => onDownload('mp4', option.value)}
                disabled={isLoading}
                className="w-full bg-primary-light dark:bg-primary-dark text-white py-2 px-4 rounded hover:bg-opacity-90 disabled:opacity-50"
              >
                Download {option.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* MP3 Download Option */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h4 className="font-medium mb-3">Audio (MP3)</h4>
          <button
            onClick={() => onDownload('mp3')}
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
          >
            Download MP3
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadOptions;