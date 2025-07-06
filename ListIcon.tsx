
import React from 'react';

const ListIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="8" y1="7" x2="16" y2="7"></line>
      <line x1="8" y1="12" x2="16" y2="12"></line>
      <line x1="8" y1="17" x2="13" y2="17"></line>
    </svg>
  );
};

export default ListIcon;
