import React, { useContext } from 'react';
import Logo from '../assets/word-logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const Sidebar = ({ items }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    sessionStorage.clear();
    setUser(null);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-2/12 bg-gray-200 p-5 flex flex-col justify-between">
      <div>
        <div className="flex justify-center mb-6">
          <img src={Logo} alt="Logo" className="w-full h-auto hidden lg:block" />
        </div>
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => navigate(item.path)}
            className={`w-full text-left px-4 py-2 text-lg font-semibold mb-4 flex items-center ${
              isActive(item.path) ? 'bg-blue-500 text-white' : 'bg-white'
            } ${!isActive(item.path) ? 'xl:justify-start justify-center' : ''}`}
          >
            <FontAwesomeIcon icon={item.icon} className="mr-2 lg:mr-2" />
            <span className="hidden xl:inline">{item.title}</span>
          </button>
        ))}
      </div>
      <div className="flex justify-start w-full">
        <button
          className="w-full py-2 font-montserrat font-bold italic bg-transparent border-2 border-black text-black hover:bg-black hover:text-white border-solid hover:scale-95 transform transition-all duration-300 ease-in-out"
        >
          LOG OUT
        </button>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      icon: PropTypes.object.isRequired, 
    })
  ).isRequired,
};

export default Sidebar;
