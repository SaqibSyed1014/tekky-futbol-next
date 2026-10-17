'use client';

import CrossIcon from './CrossIcon';

/**
 * Generic modal overlay.
 *
 * Props:
 *   isOpen            - boolean
 *   onClose           - function
 *   children          - modal body content
 *   contentClassName  - optional extra class(es) on .overlay-content (e.g. a width modifier)
 */
export default function Modal({ isOpen, onClose, children, contentClassName = '' }) {
  if (!isOpen) return null;

  return (
    <div className="coming-soon-overlay open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`overlay-content${contentClassName ? ` ${contentClassName}` : ''}`}>
        <CrossIcon onClick={onClose} />
        {children}
      </div>
    </div>
  );
}
