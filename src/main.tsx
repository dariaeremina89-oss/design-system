import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Input } from './components/Input/Input';
import './styles/tokens.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <main style={{ maxWidth: 456, margin: '48px auto', padding: 16 }}>
      <Input label="Input" placeholder="Placeholder" caption="Caption text" />
    </main>
  </StrictMode>,
);
