import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DarkModeProvider } from './DarkModeContext';
import ScrollToTop from './ScrollToTop';
import './index.css';
import Home from './Home';
import About from './About';
import Contact from './Contact';
import Dev from './Dev';

function App() {
  return (
    <DarkModeProvider>
      <Router>
        <ScrollToTop />  {/* <-- ensures scroll resets on every route change */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dev" element={<Dev />} />
        </Routes>
      </Router>
    </DarkModeProvider>
  );
}

export default App;
