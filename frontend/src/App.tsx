import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home';
import NavBar from './components/NavBar';

function App() {
  return (
    <>
    <NavBar />
    <main>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </main>
    </>
  );
}

export default App
