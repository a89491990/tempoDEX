import React from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

export const TempoLogo = ({ className }) => (
  <div className={`${className} relative`}>
    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
    <div className="relative bg-white rounded-full flex items-center justify-center h-full w-full">
      <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        T
      </span>
    </div>
  </div>
);

export const RefreshButton = ({ refreshing }) => (
  <ArrowPathIcon className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
);