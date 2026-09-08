import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from "react-router-dom"
import { ThemeProvider, createTheme} from '@mui/material/styles'
import './index.css'
import './fonts.css'
import App from './App.tsx'

const theme = createTheme({
  typography: {
    fontFamily: 'RuneScape, sans-serif',
  },
})
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
      <App />
    </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
