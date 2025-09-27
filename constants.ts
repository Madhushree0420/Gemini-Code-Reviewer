import { Language } from './types';

export const SUPPORTED_LANGUAGES: Language[] = [
  { id: 'javascript', name: 'JavaScript', extensions: ['.js', '.jsx'] },
  { id: 'typescript', name: 'TypeScript', extensions: ['.ts', '.tsx'] },
  { id: 'python', name: 'Python', extensions: ['.py'] },
  { id: 'java', name: 'Java', extensions: ['.java'] },
  { id: 'csharp', name: 'C#', extensions: ['.cs'] },
  { id: 'c', name: 'C', extensions: ['.c', '.h'] },
  { id: 'cpp', name: 'C++', extensions: ['.cpp', '.hpp', '.cc'] },
  { id: 'go', name: 'Go', extensions: ['.go'] },
  { id: 'rust', name: 'Rust', extensions: ['.rs'] },
  { id: 'html', name: 'HTML', extensions: ['.html', '.htm'] },
  { id: 'css', name: 'CSS', extensions: ['.css'] },
  { id: 'sql', name: 'SQL', extensions: ['.sql'] },
  { id: 'nosql', name: 'NoSQL', extensions: ['.json'] },
  { id: 'npm', name: 'NPM', extensions: ['package.json'] },
];