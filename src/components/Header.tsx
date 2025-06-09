
import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC<{ onLogoClick?: () => void }> = ({ onLogoClick }) => {
  return (
    <header className="flex justify-between items-center p-5 w-full relative">
      <Link to="/" className="flex flex-col items-center no-underline">
        <div className="w-12 h-9 border-2 border-[#49CA38] -mb-1" />
        <span className="text-[#49CA38] text-lg font-bold font-['Kanit']">
          puusti
        </span>
      </Link>
      
      <nav className="flex absolute left-1/2 transform -translate-x-1/2 gap-32">
        <Link 
          to="/about" 
          className="text-[#49CA38] no-underline text-lg font-['Kanit'] hover:underline"
        >
          about
        </Link>
        <Link 
          to="/something" 
          className="text-[#49CA38] no-underline text-lg font-['Kanit'] hover:underline"
        >
          something
        </Link>
        <Link 
          to="/for-investors" 
          className="text-[#49CA38] no-underline text-lg font-['Kanit'] hover:underline"
        >
          for investors
        </Link>
        <Link 
          to="/contact-us" 
          className="text-[#49CA38] no-underline text-lg font-['Kanit'] hover:underline"
        >
          contact us
        </Link>
      </nav>
    </header>
  );
};

export default Header;
