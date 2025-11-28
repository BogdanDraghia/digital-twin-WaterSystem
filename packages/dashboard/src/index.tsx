import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import HostpitalBathroom3Dscene from './views/3dScenes/HospitalBathroom'
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom'
import Dashboard from './views/Dashboard'



const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
          <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />}>
              <Route path="/dashboard3d" element={<HostpitalBathroom3Dscene/>} />
              <Route path="/dashboard" element={<Dashboard/>} />
              </Route>
            </Routes>
          </BrowserRouter>
  </React.StrictMode>
)

