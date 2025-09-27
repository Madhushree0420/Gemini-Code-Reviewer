

import React, { useState, useCallback, useRef } from 'react';
import { reviewCode } from './services/geminiService';
import { Language } from './types';
import { SUPPORTED_LANGUAGES } from './constants';
import { Header } from './components/Header';
import { LanguageSelector } from './components/LanguageSelector';
import { ReviewOutput } from './components/ReviewOutput';
import { CodeInput } from './components/CodeInput';

interface ImageState {
  data: string; // base64 encoded data
  mimeType: string;
}

// For SpeechRecognition API
// Fix: Added type definitions for the Web Speech API to resolve 'Cannot find name SpeechRecognition' error.
interface SpeechRecognitionResult {
    readonly isFinal: boolean;
    readonly length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
    readonly transcript: string;
    readonly confidence: number;
}

interface SpeechRecognitionResultList {
    readonly length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
    readonly error: string;
    readonly message: string;
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onstart: (() => void) | null;
    onend: (() => void) | null;
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    start(): void;
    stop(): void;
}

declare var SpeechRecognition: {
    prototype: SpeechRecognition;
    new(): SpeechRecognition;
};

declare var webkitSpeechRecognition: {
    prototype: SpeechRecognition;
    new(): SpeechRecognition;
};

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof webkitSpeechRecognition;
  }
}


export const App: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState<Language>(SUPPORTED_LANGUAGES[0]);
  const [review, setReview] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [image, setImage] = useState<ImageState | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const acceptedFileTypes = SUPPORTED_LANGUAGES.flatMap(lang => lang.extensions).join(',');

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

      const filename = file.name.toLowerCase();
      
      // First, try a direct match on the filename (e.g., for 'package.json')
      let detectedLanguage = SUPPORTED_LANGUAGES.find(lang => lang.extensions.includes(filename));

      // If no direct match, check by file extension
      if (!detectedLanguage) {
          const parts = filename.split('.');
          if (parts.length > 1) {
              const extension = `.${parts.pop()}`; // .pop() is safe because of length check
              detectedLanguage = SUPPORTED_LANGUAGES.find(lang => lang.extensions.includes(extension));
          }
      }
      
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

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser. Please try Chrome or Edge.');
      return;
    }
    
    // Clear state before starting a new recording
    setCode('');
    setImage(null);
    setError(null);
    setReview('');

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onend = () => {
      setIsRecording(false);
      recognitionRef.current = null;
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error, event.message);
      let errorMessage = `An unexpected error occurred: ${event.message || event.error}`;

      switch (event.error) {
        case 'not-allowed':
        case 'service-not-allowed':
          errorMessage = 'Microphone access was denied. Please allow microphone access in your browser settings to use this feature.';
          break;
        case 'no-speech':
          errorMessage = 'No speech was detected. Please make sure your microphone is working and try again.';
          break;
        case 'audio-capture':
          errorMessage = 'Audio capture failed. Could not find or access your microphone. Please check your hardware and permissions.';
          break;
        case 'network':
          errorMessage = 'A network error occurred during speech recognition. Please check your internet connection.';
          break;
        case 'aborted':
          // This can happen if the user stops the recording manually.
          // The onend event will handle the state change, so we just log it and don't set a user-facing error.
          console.log('Speech recognition was aborted.');
          return; // Exit without setting an error
      }
      setError(errorMessage);
      // The onend event will fire after onerror, cleaning up isRecording and recognitionRef.
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      setCode(transcript);
    };

    recognition.start();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 p-4 lg:p-8">
        {/* Input Section */}
        <div className="flex flex-col bg-white dark:bg-slate-800 rounded-lg shadow-lg">
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 flex-wrap gap-4">
             <div className="flex items-center gap-4 flex-wrap">
              <LanguageSelector
                selectedLanguage={language}
                onLanguageChange={setLanguage}
                disabled={!!image || isRecording}
              />
               <input type="file" ref={fileInputRef} onChange={handleCodeFileUpload} className="hidden" aria-hidden="true" accept={acceptedFileTypes} />
               <input type="file" ref={imageInputRef} onChange={handleImageFileUpload} className="hidden" aria-hidden="true" accept="image/*" />
              
              <button onClick={() => fileInputRef.current?.click()} disabled={!!image || isRecording} className="flex items-center gap-2 px-3 py-2 bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 font-medium text-sm rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75M3 17.25V6.75a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 17.25Z" /></svg>
                Upload File
              </button>
              <button onClick={() => imageInputRef.current?.click()} disabled={isRecording} className="flex items-center gap-2 px-3 py-2 bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 font-medium text-sm rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
                Upload Image
              </button>
               <button
                  onClick={toggleRecording}
                  disabled={!!image}
                  className={`flex items-center gap-2 px-3 py-2 font-medium text-sm rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isRecording
                      ? 'bg-red-600 text-white hover:bg-red-500'
                      : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                  }`}
                >
                  {isRecording ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 animate-pulse"><path fillRule="evenodd" d="M4.5 7.5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3-3h-9a3 3 0 0 1-3-3v-9Z" clipRule="evenodd" /></svg>
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6V7.5a6 6 0 0 0-12 0v5.25a6 6 0 0 0 6 6Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" /></svg>
                      Record Audio
                    </>
                  )}
                </button>
            </div>
            <button onClick={handleReview} disabled={isLoading || isRecording} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-500 disabled:bg-slate-500 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-indigo-500">
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
                languageId={language.id}
                placeholder={
                  isRecording 
                    ? 'Listening... speak into your microphone.' 
                    : image 
                    ? 'Describe the image or ask a question...' 
                    : `Paste your ${language.name} code here...`
                }
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