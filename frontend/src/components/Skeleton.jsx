import React from 'react';

export const Skeleton = ({ className = '' }) => (
  <div
    className={`bg-gray-200 rounded animate-pulse ${className}`}
    style={{ animationDuration: '1.5s' }}
  />
);

export const EventCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
    <Skeleton className="h-6 w-3/4 mb-3" />
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-2/3 mb-4" />
    <Skeleton className="h-10 w-full" />
  </div>
);

export const EventDetailsSkeleton = () => (
  <div className="max-w-4xl mx-auto">
    <Skeleton className="h-10 w-1/2 mb-6" />
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-4 w-2/3 mb-2" />
      <Skeleton className="h-4 w-1/2" />
    </div>
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <Skeleton className="h-8 w-1/3 mb-4" />
      <div className="flex flex-col items-center gap-2">
        {['A', 'B', 'C', 'D', 'E'].map((row) => (
          <div key={row} className="flex gap-2">
            <Skeleton className="w-10 h-10 rounded" />
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <Skeleton key={i} className="w-10 h-10 rounded" />
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
);
