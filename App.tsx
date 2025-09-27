import React, { useState, useCallback, useRef, useEffect } from 'react';
import { reviewCode } from './services/geminiService';
import { Language } from './types';
import { SUPPORTED_LANGUAGES } from './constants';
import { Header } from './components/Header';
import { LanguageSelector } from './components/LanguageSelector';
import { ReviewOutput } from './components/ReviewOutput';
import { CodeInput } from './components/CodeInput';

type Theme = 'light' | 'dark';

interface ImageState {
  data: string; // base64 encoded data
  mimeType: string;
}

const getInitialTheme = (): Theme => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedPrefs = window.localStorage.getItem('theme') as Theme | null;
    if (storedPrefs) {
      return storedPrefs;
    }
    const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
    if (userMedia.matches) {
      return 'dark';
    }
  }
  return 'light';
};

export const App: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState<Language>(SUPPORTED_LANGUAGES[0]);
  const [review, setReview] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [image, setImage] = useState<ImageState | null>(null);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const root = window.document.documentElement;
    const darkThemeStyle = document.getElementById('dark-theme-style') as HTMLLinkElement | null;
    const lightThemeStyle = document.getElementById('light-theme-style') as HTMLLinkElement | null;
    
    if (!darkThemeStyle || !lightThemeStyle) {
      console.error("Theme stylesheets not found in the document.");
      return;
    }

    if (theme === 'dark') {
      root.classList.add('dark');
      darkThemeStyle.disabled = false;
      lightThemeStyle.disabled = true;
    } else {
      root.classList.remove('dark');
      darkThemeStyle.disabled = true;
      lightThemeStyle.disabled = false;
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const handleReview = useCallback(async () => {
    if (!code.trim() && !image) {
      setError('Please enter some code or upload an image to review.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setReview('');

    try {
      const stream = reviewCode(code, language.name, image);
      for await (const chunk of stream) {
        setReview((prev) => prev + chunk.text);
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while reviewing. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [code, language, image]);

  const handleCodeFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setCode(content);
      setImage(null); // Clear image if a code file is uploaded

      const extension = `.${file.name.split('.').pop()}`;
      const detectedLanguage = SUPPORTED_LANGUAGES.find(lang => lang.extensions.includes(extension));
      if (detectedLanguage) {
        setLanguage(detectedLanguage);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleImageFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) {
        setError("Please select a valid image file.");
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const base64Data = dataUrl.split(',')[1];
        setImage({ data: base64Data, mimeType: file.type });
        setCode(''); // Clear code when image is uploaded
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  }
  
  const removeImage = () => {
    setImage(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 p-4 lg:p-8">
        {/* Input Section */}
        <div className="flex flex-col bg-white dark:bg-slate-800 rounded-lg shadow-lg">
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 flex-wrap gap-4">
             <div className="flex items-center gap-4 flex-wrap">
              <LanguageSelector
                selectedLanguage={language}
                onLanguageChange={setLanguage}
                disabled={!!image}
              />
               <input type="file" ref={fileInputRef} onChange={handleCodeFileUpload} className="hidden" aria-hidden="true" accept=".js,.jsx,.ts,.tsx,.py,.java,.cs,.c,.h,.go,.rs,.html,.htm,.css,.sql,.json" />
               <input type="file" ref={imageInputRef} onChange={handleImageFileUpload} className="hidden" aria-hidden="true" accept="image/*" />
              
              <button onClick={() => fileInputRef.current?.click()} disabled={!!image} className="flex items-center gap-2 px-3 py-2 bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 font-medium text-sm rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75M3 17.25V6.75a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 17.25Z" /></svg>
                Upload File
              </button>
              <button onClick={() => imageInputRef.current?.click()} className="flex items-center gap-2 px-3 py-2 bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 font-medium text-sm rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-indigo-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
                Upload Image
              </button>

            </div>
            <button onClick={handleReview} disabled={isLoading} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-500 disabled:bg-slate-500 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-indigo-500">
              {isLoading ? 'Reviewing...' : 'Review'}
            </button>
          </div>
          <div className="flex-grow relative p-4 flex flex-col gap-4">
             {image && (
                <div className="relative group">
                    <img src={`data:${image.mimeType};base64,${image.data}`} alt="Preview" className="w-full h-auto max-h-64 object-contain rounded-md" />
                    <button onClick={removeImage} className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" aria-label="Remove image">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                    </button>
                </div>
             )}
             <CodeInput
                value={code}
                onValueChange={setCode}
                placeholder={image ? 'Describe the image or ask a question...' : `Paste your ${language.name} code here...`}
              />
          </div>
        </div>

        {/* Output Section */}
        <div className="flex flex-col bg-white dark:bg-slate-800 rounded-lg shadow-lg">
          <ReviewOutput review={review} isLoading={isLoading} error={error} onRetry={handleReview} />
        </div>
      </main>
    </div>
  );
};