import React, { useState, useEffect } from 'react';
import Header from './header';
import Footer from './footer';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const navigate = useNavigate(); 

    const handleLogin = () => {
        navigate('/login')
      };

    return ( 
    <div className="font-pridi ">
    <Header/>
      <div className="relative min-h-screen flex flex-col sm:justify-center items-center ">
        <div className="relative sm:max-w-sm w-full">
          <div className="card bg-purple-500 shadow-lg w-full h-full rounded-3xl absolute transform -rotate-6"></div>
          <div className="card bg-orange-500 shadow-lg w-full h-full rounded-3xl absolute transform rotate-6"></div>
          <div className="relative w-full rounded-3xl px-6 py-4 bg-gray-100 shadow-md">
            <label  className="block text-xl mt-3 text-purple-700 text-center font-bold border-2 border-slate-300">
              Signup with MetaMask
            </label>
            <form method="#" action="#" className="mt-10">
              <div>
                <input
                  type="nickname"
                  placeholder="Nickame"
                  className="mt-1 p-5 block w-full border-none bg-gray-100 h-11 rounded-xl shadow-lg hover:bg-blue-100 duration-500 "
                />
              </div>

              <div className="mt-7 flex">


                <div className="w-full text-right">

                </div>
              </div>

              <div className="mt-7">
                <button
                  type="submit"
                  className="bg-orange-400 w-full py-3 rounded-xl text-white shadow-xl focus:outline-none transition duration-500 ease-in-out transform hover:-translate-x hover:scale-105 hover:shadow-sm"
                >
                  Signup
                </button>
              </div>

              <div className="mt-7">
                <div className="flex justify-center items-center">

                  <a className="underline text-sm text-gray-600 hover:text-gray-900  duration-500 cursor-pointer hover:scale-105 " onClick={handleLogin}>Sei già registrato con MetaMask?</a>

                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
     <Footer/> 
    </div>
  );
}

export default Signup;