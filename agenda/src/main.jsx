import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ListaContactos } from './components/ListaContactos'
import './css/style.css'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ListaContactos></ListaContactos>
  </StrictMode>,
)
