import React from 'react';

export const Shimmer = ({ className = '' }) => (
  <div className={`animate-shimmer rounded ${className}`}></div>
);

export const CardSkeleton = () => (
  <div className="glass-panel p-6 rounded-2xl border border-neutral-200/10 space-y-4">
    <div className="flex justify-between items-center">
      <Shimmer className="h-6 w-1/3 bg-neutral-200/10 dark:bg-neutral-800/40" />
      <Shimmer className="h-8 w-8 rounded-full bg-neutral-200/10 dark:bg-neutral-800/40" />
    </div>
    <Shimmer className="h-10 w-2/3 bg-neutral-200/10 dark:bg-neutral-800/40" />
    <Shimmer className="h-4 w-1/2 bg-neutral-200/10 dark:bg-neutral-800/40" />
  </div>
);

export const ListSkeleton = ({ rows = 4 }) => (
  <div className="space-y-3 w-full">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center space-x-4 p-4 rounded-xl bg-neutral-200/5 dark:bg-neutral-800/20">
        <Shimmer className="h-10 w-10 rounded-lg bg-neutral-200/10 dark:bg-neutral-800/40" />
        <div className="flex-1 space-y-2">
          <Shimmer className="h-4 w-1/4 bg-neutral-200/10 dark:bg-neutral-800/40" />
          <Shimmer className="h-3 w-1/2 bg-neutral-200/10 dark:bg-neutral-800/40" />
        </div>
        <Shimmer className="h-6 w-12 bg-neutral-200/10 dark:bg-neutral-800/40" />
      </div>
    ))}
  </div>
);

export const ChartSkeleton = () => (
  <div className="glass-panel p-6 rounded-2xl border border-neutral-200/10 flex flex-col justify-between h-[300px]">
    <div className="space-y-2">
      <Shimmer className="h-5 w-1/4 bg-neutral-200/10 dark:bg-neutral-800/40" />
      <Shimmer className="h-3 w-1/3 bg-neutral-200/10 dark:bg-neutral-800/40" />
    </div>
    <div className="flex items-end justify-between h-[180px] px-4">
      <Shimmer className="h-[20%] w-10 bg-neutral-200/10 dark:bg-neutral-800/40 rounded-t" />
      <Shimmer className="h-[50%] w-10 bg-neutral-200/10 dark:bg-neutral-800/40 rounded-t" />
      <Shimmer className="h-[80%] w-10 bg-neutral-200/10 dark:bg-neutral-800/40 rounded-t" />
      <Shimmer className="h-[40%] w-10 bg-neutral-200/10 dark:bg-neutral-800/40 rounded-t" />
      <Shimmer className="h-[95%] w-10 bg-neutral-200/10 dark:bg-neutral-800/40 rounded-t" />
      <Shimmer className="h-[60%] w-10 bg-neutral-200/10 dark:bg-neutral-800/40 rounded-t" />
    </div>
  </div>
);
