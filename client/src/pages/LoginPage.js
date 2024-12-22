import React, { useContext, useEffect, useState } from 'react';
import icon from '../assets/iconmeta.png';
import Header from './header';
import Footer from './footer';
import { useNavigate } from 'react-router-dom';
import { fetchNonce } from '../utils/fetchNonce';
import { ethers } from 'ethers'
import {utenteABI} from '../AddressABI/utenteABI';
import {utenteAddress} from '../AddressABI/utenteAddress';
import {AccountContext} from '../context/AccountContext';

//login con metamask + controllo di iscrizione ad amethyst stesso
function Login() {
    const [isMetamask, setIsMetamask] = useState(false);
    const [nonce, setNonce] = useState(null);
    const navigate = useNavigate();
    const {setAccount, setRegistered} = useContext(AccountContext);

    useEffect(() => {
        if (typeof window.ethereum !== "undefined") {
            console.log("MetaMask is available!");
            setIsMetamask(true);
        } else {
            console.log("MetaMask is not available.");
        }
    }, []);

    useEffect(() => {
        const getNonce = async () => {
            try {
                const nonce = await fetchNonce();
                setNonce(nonce);
                console.log("Nonce ricevuto:", nonce);
            } catch (error) {
                console.error("Errore durante il recupero del nonce:", error);
            }
        };

        if (isMetamask) {
            getNonce();
        }
    }, [isMetamask]);

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            navigate("/login");
        }
    }, []);

    const handleLogin = async () => {
      try {
          // 1. Richiesta dell'account tramite MetaMask
          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
          const userAccount = accounts[0];
          console.log("Account selezionato:", userAccount);

          setAccount(userAccount);
          
          // 4. Firma del nonce
          let signature;
          try {
              signature = await window.ethereum.request({
                  method: "personal_sign",
                  params: [nonce, userAccount],
              });
              console.log("Firma ricevuta:", signature);
          } catch (error) {
              console.error("Errore durante la firma del nonce:", error);
              return;
          }
  
          // 5. Verifica la firma con il backend
          let response;
          try {
              response = await fetch("http://localhost:5000/verify", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ account: userAccount, signature, nonce }),
              });
          } catch (error) {
              console.error("Errore durante la chiamata al backend per la verifica:", error);
              return;
          }
  
          let result;
          try {
              result = await response.json();
              console.log("Risultato della verifica:", result);
          } catch (error) {
              console.error("Errore nella conversione della risposta JSON:", error);
              return;
          }
  
          if (result.success) {
              if (result.token) {
                  localStorage.setItem("jwtToken", result.token);
                  console.log("JWT salvato:", result.token);
                  verifyTokenWithApi(result.token);
              } else {
                  console.error("JWT non presente nella risposta:", result);
                  alert("Errore: token non ricevuto dal server.");
              }
          } else {
              alert(`Verifica fallita: ${result.error}`);
              return;
          }

          verifySubscription(userAccount);

      } catch (error) {
          console.error("Errore durante il login:", error);
      }
  };
  
    const verifyTokenWithApi = async (token) => {
        try {
            const response = await fetch("http://localhost:5000/dashboard", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const result = await response.json();
            if (response.ok && result.success) {
                console.log("JWT CORRETTO");
            } else {
                console.error("Accesso negato: Token non valido.");
                alert("Token non valido, effettuare nuovamente il login.");
                localStorage.removeItem("jwtToken");
                navigate("/"); //anche qui vedremo dove portarla in caso di errore
            }
        } catch (error) {
            console.error("Errore durante la verifica del token:", error);
            navigate("/");    //stessa cosa
        }
    };

    const verifySubscription = async (userAccount) => {
        console.log("ACCOUNT: ", userAccount);

        if (!userAccount) return;

              // Usa BrowserProvider per interagire con Metamask
              const provider = new ethers.BrowserProvider(window.ethereum); // Usa BrowserProvider per v6
        
              const contract = new ethers.Contract(utenteAddress, utenteABI, provider);
              console.log("CONTRACT:", contract);

              try {
                const isRegistered = await contract.get_utente_registrato(userAccount);
                console.log("RISULTATO: ", isRegistered);
                
                setRegistered(isRegistered);
                
                if(isRegistered){
                    console.log("Utente Registrato anche in Amethyst!")
                    navigate("/");
                }else{
                    console.log("Utente NON registrato in Amethyst quindi vai a signup!")
                    navigate('/register');
                    //mi fa apparire una cosa per dirmi che devo registrarmi ANCHE ad amethyst perchè ho bisogno del nickname
                }

              } catch (error) {
                console.log("ERRORE nel prelievo valore boleano: ", error);
              }
        
    };

    return (
        <div className="bg-gradient-to-b from-indigo-700 to-purple-600 min-h-screen flex flex-col justify-between">
            <Header />
            <div className="h-[700px] flex-grow flex items-center justify-center bg-gradient-to-b from-indigo-700 via-indigo-500 to-purple-600">
                <div className="max-w-lg w-full bg-white p-8 rounded-3xl shadow-xl transform transition-all hover:scale-105 duration-300">
                    <div className="text-center mb-6">
                        <h2 className="p-3 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-600">
                            Login with MetaMask!
                        </h2>
                        <p className="mt-2 text-lg text-gray-600 font-pridi">
                            Un accesso sicuro al tuo profilo personale.
                        </p>
                    </div>
                    <button
                        onClick={handleLogin}
                        className="border-2 border-black w-full flex items-center justify-center bg-orange-600 text-white font-semibold py-3 px-6 rounded-xl shadow-2xl hover:scale-105 transition-all duration-300 transform hover:bg-orange-500"
                    >
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
