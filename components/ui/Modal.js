'use client';

import CrossIcon from './CrossIcon';

/**
 * Generic modal overlay.
 *
 * Props:
 *   isOpen   - boolean
 *   onClose  - function
 *   children - modal body content
 */
export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="coming-soon-overlay open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="overlay-content">
        <CrossIcon onClick={onClose} />
        {children}
      </div>
    </div>
  );
}
