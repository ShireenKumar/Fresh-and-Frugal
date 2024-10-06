import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex justify-around text-white">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/">My Pantry</Link></li> 
        <li><Link to="/">My Recipes</Link></li> 
        <li><button>Log out</button></li>
      </ul>
    </nav>
  );
};

export default Navbar;
