import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home';
import NavBar from './components/NavBar';
import { useState } from 'react';

function App() {

  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
    <NavBar 
      searchQuery  = {searchQuery}
      setSearchQuery = {setSearchQuery}
    />
    <main>
      <Routes>
        <Route 
          path="/" 
          element={<Home searchQuery={searchQuery}/>} />
      </Routes>
    </main>
    </>
  );
}

export default App
