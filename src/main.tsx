import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App.tsx'
import { store } from './redux/store.ts'
import './main.css'
import { ThemeProvider, createTheme } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'

const theme = createTheme({
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale="en-US">
          <App />
        </LocalizationProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
)
