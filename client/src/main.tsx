import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import { Web3Provider } from './providers/Web3Provider'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Web3Provider>
      <App />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
    </Web3Provider>
  </StrictMode>,
)
