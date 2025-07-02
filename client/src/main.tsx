import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
// import { Web3Provider } from './context/Web3Provider'
import './index.css'
import App from './App'
import { ThemeProvider } from './context/themeProvider'
import { WalletProvider } from './context/walletProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme" >
      <WalletProvider>
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
      </WalletProvider>
    </ThemeProvider>
  </StrictMode>,
)
