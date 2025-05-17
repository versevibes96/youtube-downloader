import ThemeToggle from './ThemeToggle';

const Header = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary-light dark:text-primary-dark">
          YouTube Downloader
        </h1>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;