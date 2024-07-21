import React from "react";
import { Link } from "react-router-dom"; // If you are using react-router for navigation

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-semibold">Kubernetes GUI</div>
        <div className="flex space-x-4">
          <Link to="/" className="text-gray-300 hover:text-white">
            Home
          </Link>
          <Link to="/pods" className="text-gray-300 hover:text-white">
            Pods
          </Link>
          <Link to="/services" className="text-gray-300 hover:text-white">
            Services
          </Link>
          <Link to="/deployments" className="text-gray-300 hover:text-white">
            Deployments
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
