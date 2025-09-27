import React from 'react';

interface HeaderProps {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => (
  <header className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
    <div className="container mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-indigo-500 dark:text-indigo-400">
          <title>Code Review Icon</title>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.03 1.125 0 1.131.094 1.976 1.057 1.976 2.192V7.5M8.25 7.5h7.5m-7.5 0-1 9m7.5-9 1 9m-8 9h10c1.036 0 1.909-.84 2.008-1.864l.76-7.598A2.25 2.25 0 0 0 18.25 8.25H5.75A2.25 2.25 0 0 0 3.5 10.5l.76 7.598A2.25 2.25 0 0 0 6.25 20Z" />
        </svg>
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Gemini Code Reviewer</h1>
      </div>
      <div className="flex items-center gap-2">
         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 transition-colors ${theme === 'light' ? 'text-yellow-500' : 'text-slate-500'}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
        </svg>
        <button
          onClick={toggleTheme}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
            theme === 'light' ? 'bg-indigo-600' : 'bg-slate-600'
          }`}
          role="switch"
          aria-checked={theme === 'light'}
          aria-label="Toggle theme: Light mode is on, Dark mode is off"
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              theme === 'light' ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 transition-colors ${theme === 'dark' ? 'text-indigo-400' : 'text-slate-500'}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
        </svg>
      </div>
    </div>
  </header>
);