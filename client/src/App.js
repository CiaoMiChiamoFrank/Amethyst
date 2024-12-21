import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/homepage';
import Header from './pages/header';
import Footer from './pages/footer';
import Login from './pages/LoginPage';
import Signup from './pages/SignupPage';

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/header" element={<Header />} />
      <Route path="/footer" element={<Footer />} />
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Signup/>} />
    </Routes>
    </Router>
    
  );
}

export default App;
