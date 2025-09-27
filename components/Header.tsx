import React from 'react';

export const Header: React.FC = () => (
  <header className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
    <div className="container mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-indigo-500 dark:text-indigo-400">
          <title>Code Review Icon</title>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.03 1.125 0 1.131.094 1.976 1.057 1.976 2.192V7.5M8.25 7.5h7.5m-7.5 0-1 9m7.5-9 1 9m-8 9h10c1.036 0 1.909-.84 2.008-1.864l.76-7.598A2.25 2.25 0 0 0 18.25 8.25H5.75A2.25 2.25 0 0 0 3.5 10.5l.76 7.598A2.25 2.25 0 0 0 6.25 20Z" />
        </svg>
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Gemini Code Reviewer</h1>
      </div>
    </div>
  </header>
);