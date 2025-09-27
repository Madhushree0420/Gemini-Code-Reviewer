import React, { useState, useRef, useEffect } from 'react';
import Editor from 'react-simple-code-editor';

// Prism is loaded globally from index.html
declare global {
  interface Window {
    Prism: any;
  }
}

interface CodeInputProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  languageId: string;
}

export const CodeInput: React.FC<CodeInputProps> = ({ value, onValueChange, placeholder, languageId }) => {
  const lineNumbersRef = useRef<HTMLTextAreaElement>(null);
  const editorWrapperRef = useRef<HTMLDivElement>(null);
  const [lineNumbers, setLineNumbers] = useState('1');

  useEffect(() => {
    const lineCount = value.split('\n').length;
    setLineNumbers(Array.from({ length: lineCount }, (_, i) => i + 1).join('\n'));
  }, [value]);

  useEffect(() => {
    const editor = editorWrapperRef.current?.querySelector('textarea');
    const lineNumbers = lineNumbersRef.current;
    if (editor && lineNumbers) {
      const syncScroll = () => {
        lineNumbers.scrollTop = editor.scrollTop;
      };
      editor.addEventListener('scroll', syncScroll);
      return () => editor.removeEventListener('scroll', syncScroll);
    }
  }, []); // Run once on mount

  const highlightCode = (code: string) => {
    // Check if Prism and the language are loaded
    if (window.Prism && window.Prism.languages[languageId]) {
      // The Prism autoloader might not have loaded the language yet,
      // so we use highlightAll under the hood to be safe.
      return window.Prism.highlight(code, window.Prism.languages[languageId], languageId);
    }
    // Fallback for plaintext, escaping HTML entities to be safe
    return code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };

  return (
    <div className="flex h-full w-full bg-slate-100 dark:bg-slate-800 rounded-b-lg font-mono flex-grow">
      <textarea
        ref={lineNumbersRef}
        className="w-12 text-right pr-2 py-4 bg-transparent text-slate-400 dark:text-slate-500 resize-none select-none focus:outline-none"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
        value={lineNumbers}
        readOnly
        aria-hidden="true"
      />
      <div ref={editorWrapperRef} className="flex-grow relative">
        <Editor
          value={value}
          onValueChange={onValueChange}
          highlight={highlightCode}
          padding={16}
          onKeyDown={e => {
            if (e.key === 'Tab' && !e.shiftKey) {
              e.preventDefault();
              const textarea = e.currentTarget;
              const { selectionStart, selectionEnd } = textarea;
              const newValue =
                value.substring(0, selectionStart) +
                '  ' +
                value.substring(selectionEnd);

              onValueChange(newValue);

              setTimeout(() => {
                textarea.selectionStart = textarea.selectionEnd = selectionStart + 2;
              }, 0);
            }
          }}
          placeholder={placeholder}
          className="code-editor-instance"
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '1em',
            lineHeight: 1.6,
          }}
          wrap="off"
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          aria-label="Code input"
        />
      </div>
      {/* Scoped styles for the editor component */}
      <style>{`
        :root { --caret-color: #334155; }
        .dark { --caret-color: #e2e8f0; }

        .code-editor-instance {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: auto;
        }

        .code-editor-instance > textarea,
        .code-editor-instance > pre {
            padding: 1rem !important;
            white-space: pre !important;
            word-wrap: normal !important;
        }

        .code-editor-instance > textarea {
          outline: none;
          background-color: transparent !important;
          color: transparent;
          -webkit-text-fill-color: transparent; /* Safari */
          caret-color: var(--caret-color);
        }

        .code-editor-instance > pre {
           color: #334155; /* Fallback text color */
        }
        .dark .code-editor-instance > pre {
           color: #cbd5e1; /* Fallback text color for dark mode */
        }
      `}</style>
    </div>
  );
};
