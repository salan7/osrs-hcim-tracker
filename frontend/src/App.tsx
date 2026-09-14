import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home';
import NavBar from './components/NavBar';
import { useState } from 'react';
import homeBackground from "./assets/homeBackground.png";
import pillarLeft from "./assets/pillarLeft.png";
import pillarRight from "./assets/pillarRight.png";
import { Box } from '@mui/material';

function App() {

  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `url(${homeBackground})`,
        backgroundRepeat: "repeat",
      }}
    >
      <NavBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <Box
        sx={{
          position: "relative",
          minHeight: "calc(100vh - 64px)",
        }}
      >
        {/* Left pillar */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            width: "28px",
            backgroundImage: `url(${pillarLeft})`,
            backgroundRepeat: "repeat-y",
            backgroundPosition: "top left",
          }}
        />

        {/* Right pillar */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            width: "28px",
            backgroundImage: `url(${pillarRight})`,
            backgroundRepeat: "repeat-y",
            backgroundPosition: "top right",
          }}
        />

        <main>
          <Routes>
            <Route
              path="/"
              element={<Home searchQuery={searchQuery} />}
            />
          </Routes>
        </main>
      </Box>
    </Box>
  );
}

export default App
