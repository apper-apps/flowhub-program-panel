import React from "react";

const Loading = ({ variant = "default", className = "" }) => {
  if (variant === "table") {
    return (
<div className={`space-y-3 sm:space-y-4 ${className}`}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-100/50 shadow-sm">
            <div className="shimmer h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 flex-shrink-0"></div>
            <div className="flex-1 space-y-2 min-w-0">
              <div className="shimmer h-3 sm:h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="shimmer h-2 sm:h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="shimmer h-3 sm:h-4 bg-gray-200 rounded w-16 sm:w-24 flex-shrink-0"></div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "cards") {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 ${className}`}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="shimmer h-6 w-6 sm:h-8 sm:w-8 rounded-lg bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 flex-shrink-0"></div>
              <div className="shimmer h-3 sm:h-4 w-12 sm:w-16 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="shimmer h-6 sm:h-8 bg-gray-200 rounded w-16 sm:w-20"></div>
              <div className="shimmer h-3 sm:h-4 bg-gray-200 rounded w-24 sm:w-32"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center p-6 sm:p-8 ${className}`}>
      <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary shadow-lg"></div>
    </div>
  );
};

export default Loading;