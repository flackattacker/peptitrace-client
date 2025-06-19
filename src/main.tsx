console.log('DEBUG: Line 1 - This should be the first line');
console.log('DEBUG: Line 2 - Checking what is actually here');
console.log('DEBUG: Line 3 - Before import statements');
console.log('DEBUG: Line 4 - Last line before React import');
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('DEBUG: main.tsx - After imports, before render');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

console.log('DEBUG: main.tsx - File execution completed');