import React from 'react';

export const SkeletonCard = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm animate-pulse">
      <div className="h-56 bg-slate-200 dark:bg-slate-800 w-full" />
      <div className="p-5 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-md w-1/2" />
          <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-full w-16" />
        </div>
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4" />
        <div className="flex gap-2 pt-2">
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-md w-14" />
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-md w-14" />
        </div>
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-full mt-2" />
      </div>
    </div>
  );
};
