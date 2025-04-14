import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-gray-900 text-white border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl mr-2">🛡️</span>
              <span className="text-xl font-bold">PacketSniffer</span>
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link to="/dashboard" className="text-gray-300 hover:text-white">
              Dashboard
            </Link>
            <Link to="/docs" className="text-gray-300 hover:text-white">
              Documentation
            </Link>
            <Link to="/about" className="text-gray-300 hover:text-white">
              About
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link 
              to="/login" 
              className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-700"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
