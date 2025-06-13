
import React from 'react';
import { Link } from 'react-router-dom';
import puustibiglogo from '../components/puusti-biglogo.jpeg';

const Header: React.FC<{ onLogoClick?: () => void }> = ({ onLogoClick }) => {
  return (
    <header className="flex justify-between items-center p-5 w-full relative">
      <Link to="/" className="flex flex-col items-center no-underline">
        <img 
          src= {puustibiglogo}
          alt="puusti squared logo" 
          className="h-12 w-auto" 
        />
      </Link>
      
      <nav className="flex absolute left-1/2 transform -translate-x-1/2 gap-32">
        <Link 
          to="/about" 
          className="text-[#32ad41] no-underline text-lg font-['Kanit'] hover:underline"
        >
          about
        </Link>
        <Link 
          to="/something" 
          className="text-[#32ad41] no-underline text-lg font-['Kanit'] hover:underline"
        >
          something
        </Link>
        <Link 
          to="/for-investors" 
          className="text-[#32ad41] no-underline text-lg font-['Kanit'] hover:underline whitespace-nowrap"
        >
          for investors
        </Link>
        <Link 
          to="/contact-us" 
          className="text-[#32ad41] no-underline text-lg font-['Kanit'] hover:underline whitespace-nowrap"
        >
          contact us
        </Link>
        <Link 
          to="/register" 
          className="text-[#32ad41] no-underline text-lg font-['Kanit'] hover:underline"
        >
            register
        </Link>
      </nav>  
    </header>
  );
};
export default Header;
