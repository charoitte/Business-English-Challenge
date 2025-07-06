
import React from 'react';

interface StarIconProps {
  isFilled: boolean;
  onClick: (e: React.MouseEvent<SVGSVGElement>) => void;
  className?: string;
}

const StarIcon: React.FC<StarIconProps> = ({ isFilled, onClick, className = 'w-6 h-6' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={isFilled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${className} ${isFilled ? 'text-yellow-400' : 'text-gray-500 hover:text-yellow-400'} transition-colors duration-200`}
      onClick={onClick}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
  );
};

export default StarIcon;
