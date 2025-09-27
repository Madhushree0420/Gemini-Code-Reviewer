import React, { useState, useEffect } from 'react';
import { Loader } from './Loader';

declare global {
  interface Window {
    marked: any;
    Prism: any;
  }
}

interface ReviewOutputProps {
  review: string;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

export const ReviewOutput: React.FC<ReviewOutputProps> = ({ review, isLoading, error, onRetry }) => {
  const [copyButtonText, setCopyButtonText] = useState('Copy');
  
  // Configure marked to use Prism for syntax highlighting
  useEffect(() => {
    if (window.marked && window.Prism) {
      const renderer = new window.marked.Renderer();
      renderer.code = (code: string, lang: string) => {
        const language = lang || 'clike';
        if (window.Prism.languages[language]) {
          const highlightedCode = window.Prism.highlight(code, window.Prism.languages[language], language);
          return `<pre class="language-${language} line-numbers"><code>${highlightedCode}</code></pre>`;
        }
        return `<pre class="language-none"><code>${code}</code></pre>`;
      };
      window.marked.setOptions({ renderer });
    }
  }, []);

  // Trigger Prism highlighting after content renders
  useEffect(() => {
    if (review) {
      setCopyButtonText('Copy');
      // Delay highlight to allow DOM to update
      setTimeout(() => window.Prism?.highlightAll(), 0);
    }
  }, [review]);

  const handleCopy = () => {
    if (!review) return;
    navigator.clipboard.writeText(review).then(
      () => {
        setCopyButtonText('Copied!');
        setTimeout(() => setCopyButtonText('Copy'), 2000);
      },
      (err) => {
        setCopyButtonText('Failed!');
        console.error('Could not copy text: ', err);
      }
    );
  };

  const WelcomeMessage = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-slate-400 dark:text-slate-500 mb-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
      </svg>
      <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300">Review Output</h2>
      <p className="text-slate-500 dark:text-slate-400 mt-2">
        Your code or image review will appear here.
      </p>
    </div>
  );

  const ErrorDisplay = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-red-500 mb-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.007H12v-.007Z" />
      </svg>
      <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">An Error Occurred</h2>
      <p className="text-slate-500 dark:text-slate-400 mt-2 mb-6 max-w-md">
        {error}
      </p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-500 transition-colors duration-200"
      >
        Try Again
      </button>
    </div>
  );

  const renderContent = () => {
    if (isLoading && !review) return <Loader />;
    if (error) return <ErrorDisplay />;
    if (!review && !isLoading) return <WelcomeMessage />;

    if (!review.trim() && !isLoading) {
      return <div className="p-6 text-slate-500 dark:text-slate-400">No review content available.</div>;
    }
    
    const dirtyHtml = window.marked.parse(review);
    
    return (
      <div 
        className="review-content p-4 lg:p-6 text-slate-700 dark:text-slate-300
                    prose-h3:text-slate-800 dark:prose-h3:text-slate-100
                    prose-strong:text-slate-900 dark:prose-strong:text-slate-50
                    prose-blockquote:text-slate-500 dark:prose-blockquote:text-slate-400
                    prose-blockquote:border-indigo-500
                    prose-code:bg-slate-200 dark:prose-code:bg-slate-700
                    prose-h3:border-slate-300 dark:prose-h3:border-slate-700
                    "
        dangerouslySetInnerHTML={{ __html: dirtyHtml }}
      />
    );
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center gap-2">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Review</h2>
        {review && !isLoading && !error && (
            <button
              onClick={handleCopy}
              className="px-3 py-1 text-sm bg-slate-200 text-slate-700 dark:bg-slate-600 dark:text-slate-300 font-semibold rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors duration-200"
              aria-label="Copy review to clipboard"
            >
              {copyButtonText}
            </button>
        )}
      </div>
      <div className="flex-grow overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};