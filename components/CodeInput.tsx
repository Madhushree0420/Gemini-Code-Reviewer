import React, { useState, useRef, useEffect, useCallback } from 'react';

interface CodeInputProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
}

export const CodeInput: React.FC<CodeInputProps> = ({ value, onValueChange, placeholder }) => {
  const [lineNumbers, setLineNumbers] = useState('1');
  const lineNumbersRef = useRef<HTMLTextAreaElement>(null);
  const codeEditorRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const lines = value.split('\n').length;
    const newNumbers = Array.from({ length: lines }, (_, i) => i + 1).join('\n');
    setLineNumbers(newNumbers);
  }, [value]);

  const handleScroll = () => {
    if (lineNumbersRef.current && codeEditorRef.current) {
      lineNumbersRef.current.scrollTop = codeEditorRef.current.scrollTop;
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle Tab key for indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const { selectionStart, selectionEnd } = e.currentTarget;
      const newValue = 
        value.substring(0, selectionStart) + 
        '  ' + 
        value.substring(selectionEnd);
      
      onValueChange(newValue);
      
      // Move cursor after the inserted spaces
      setTimeout(() => {
        if(codeEditorRef.current) {
          codeEditorRef.current.selectionStart = codeEditorRef.current.selectionEnd = selectionStart + 2;
        }
      }, 0);
    }
  };

  return (
    <div className="flex h-full w-full bg-slate-100 dark:bg-slate-800 rounded-b-lg font-mono flex-grow">
      <textarea
        ref={lineNumbersRef}
        className="w-12 text-right pr-2 py-4 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 resize-none select-none focus:outline-none"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
        value={lineNumbers}
        readOnly
        aria-hidden="true"
      />
      <textarea
        ref={codeEditorRef}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-grow bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 p-4 rounded-br-lg resize-none focus:outline-none placeholder-slate-400 dark:placeholder-slate-500"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
        aria-label="Code input"
        wrap="off"
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
      />
    </div>
  );
};