import React from 'react';
import icon from '../assets/iconmeta.png';
import Header from './header';
import Footer from './footer';
import { useNavigate } from 'react-router-dom';

function Login() {
    
  return (
    <div className="bg-gradient-to-b from-indigo-700 to-purple-600 min-h-screen flex flex-col justify-between">
      <Header />
      <div className="h-[700px] flex-grow flex items-center justify-center bg-gradient-to-b from-indigo-700 via-indigo-500 to-purple-600">
        <div className="max-w-lg w-full bg-white p-8 rounded-3xl shadow-xl transform transition-all hover:scale-105 duration-300">
          <div className="text-center mb-6">
            <h2 className="p-3 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-600">
              Login with MetaMask!"
            </h2>
            <p className="mt-2 text-lg text-gray-600 font-pridi">
              Un accesso sicuro al tuo profilo personale.
            </p>
          </div>
          <button className="border-2 border-black w-full flex items-center justify-center bg-orange-600 text-white font-semibold py-3 px-6 rounded-xl shadow-2xl hover:scale-105 transition-all duration-300 transform hover:bg-orange-500">
            <span className="mr-4 text-3xl font-pridi">Click Here</span>
            <img src={icon} alt="MetaMask Icon" className="w-10 h-10" />
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Login;
