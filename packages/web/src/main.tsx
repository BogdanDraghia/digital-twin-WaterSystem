import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {
  BrowserRouter,
  Route,
  Routes
} from 'react-router'
import HostpitalBathroom3Dscene from './modules/scene/HospitalBathroom.tsx'

createRoot(
  document.getElementById('root')!
).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route
          path="dashboard"
          element={<HostpitalBathroom3Dscene />}
        />
      </Route>
    </Routes>
  </BrowserRouter>
)
