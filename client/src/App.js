import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {AccountProvider} from './context/AccountContext';
import Homepage from './pages/homepage';
import Header from './pages/header';
import Footer from './pages/footer';
import Login from './pages/LoginPage';
import Signup from './pages/SignupPage';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <AccountProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/header" element={<Header />} />
          <Route path="/footer" element={<Footer />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Signup/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
        </Routes>
      </Router>
    </AccountProvider>
  );
}

export default App;
