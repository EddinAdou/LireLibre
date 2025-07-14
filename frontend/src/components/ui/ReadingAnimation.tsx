/**
 * ReadingAnimation - Animation de pages qui se tournent
 * Effet visuel pour le footer
 */

import React from 'react';

const ReadingAnimation: React.FC = () => {
  return (
    <div className="relative w-8 h-8 mx-auto">
      <div className="absolute inset-0">
        {/* Page 1 */}
        <div className="absolute inset-0 bg-white rounded-sm transform rotate-0 animate-pulse">
          <div className="p-1">
            <div className="w-full h-1 bg-gray-300 rounded mb-1"></div>
            <div className="w-3/4 h-1 bg-gray-300 rounded mb-1"></div>
            <div className="w-5/6 h-1 bg-gray-300 rounded"></div>
          </div>
        </div>
        
        {/* Page 2 - turning effect */}
        <div className="absolute inset-0 bg-blue-100 rounded-sm transform rotate-1 animate-pulse delay-500 opacity-80">
          <div className="p-1">
            <div className="w-full h-1 bg-blue-300 rounded mb-1"></div>
            <div className="w-4/5 h-1 bg-blue-300 rounded mb-1"></div>
            <div className="w-2/3 h-1 bg-blue-300 rounded"></div>
          </div>
        </div>
        
        {/* Page 3 */}
        <div className="absolute inset-0 bg-purple-100 rounded-sm transform rotate-2 animate-pulse delay-1000 opacity-60">
          <div className="p-1">
            <div className="w-full h-1 bg-purple-300 rounded mb-1"></div>
            <div className="w-3/5 h-1 bg-purple-300 rounded mb-1"></div>
            <div className="w-4/5 h-1 bg-purple-300 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingAnimation;
