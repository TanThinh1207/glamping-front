import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

const Dropdown = ({ items, selected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  const filteredItems = items.filter(item =>
    item?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" style={{minWidth: "150px"}} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full px-4 py-2 bg-white"
      >
        {selected || 'Select a destination'}
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
          <div className="p-2">
            <input
              type="text"
              placeholder="Search destinations..."
              className="w-full px-3 py-2 border rounded-md mb-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <ul>
            {filteredItems.map((item) => (
              <li
                key={item.id}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-50 ${
                  selected === item.name ? 'bg-blue-50' : ''
                }`}
                onClick={() => {
                  onSelect(item.name);
                  setIsOpen(false);
                  setSearchTerm('');
                }}
              >
                {item.name}
              </li>
            ))}
          </ul>
          {filteredItems.length === 0 && (
            <div className="px-4 py-2 text-gray-500">No destinations found</div>
          )}
        </div>
      )}
    </div>
  );
};

Dropdown.propTypes = {
  items: PropTypes.array.isRequired,
  selected: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};

export default Dropdown;