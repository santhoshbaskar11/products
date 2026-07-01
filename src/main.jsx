import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { ShopContextProvider } from './context/ShopContext.jsx'
import { AuthContextProvider } from './context/AuthContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <ShopContextProvider>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </ShopContextProvider>
    </HashRouter>
  </StrictMode>,
)
