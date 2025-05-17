const VideoInfo = ({ videoData, isLoading }) => {
  if (isLoading) {
    return (
      <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg p-4 w-full max-w-2xl mx-auto mt-6">
        <div className="h-48 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="mt-4 space-y-2">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!videoData) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 w-full max-w-2xl mx-auto mt-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/3">
          <img
            src={videoData.thumbnail}
            alt={videoData.title}
            className="w-full h-auto rounded-lg"
          />
        </div>
        <div className="w-full md:w-2/3">
          <h2 className="text-xl font-bold mb-2">{videoData.title}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            {videoData.channel}
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Duration: {videoData.duration}
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Views: {videoData.views}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoInfo;