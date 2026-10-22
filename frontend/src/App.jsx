import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import Interview from './pages/Interview'
import NotFound from './pages/NotFound'
import Questions from './pages/Questions'
import Resume from './pages/Resume'
import Salary from './pages/Salary'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="interview" element={<Interview />} />
        <Route path="resume" element={<Resume />} />
        <Route path="questions" element={<Questions />} />
        <Route path="salary" element={<Salary />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
