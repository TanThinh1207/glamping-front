import React, { useEffect, useRef } from "react";

const Modal = ({ isOpen, onClose, children }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Ignore clicks inside modal or MUI DatePicker popper
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        !event.target.closest('.MuiPopper-root')
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div ref={modalRef} className="bg-white shadow-lg p-6 lg:w-2/3 relative">
        <button onClick={onClose} className="absolute top-2 right-2 pr-2">✕</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
