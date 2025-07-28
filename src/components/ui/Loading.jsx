import React from "react";

const Loading = ({ variant = "default", className = "" }) => {
  if (variant === "table") {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-100">
            <div className="shimmer h-10 w-10 rounded-full bg-gray-200"></div>
            <div className="flex-1 space-y-2">
              <div className="shimmer h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="shimmer h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="shimmer h-4 bg-gray-200 rounded w-24"></div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "cards") {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="shimmer h-8 w-8 rounded-lg bg-gray-200"></div>
              <div className="shimmer h-4 w-16 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="shimmer h-8 bg-gray-200 rounded w-20"></div>
              <div className="shimmer h-4 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
};

export default Loading;