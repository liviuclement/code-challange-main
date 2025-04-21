import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav className="fixed z-50 w-full top-0 left-0 bg-gray-900 text-white py-4 px-8 md:px-20 flex gap-4">
      <Link to="/search" className="hover:underline">
        Search
      </Link>
      <Link to="/big-data" className="hover:underline">
        Big Data
      </Link>
    </nav>
  );
};

export default NavBar;
