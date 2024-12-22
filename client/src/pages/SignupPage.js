import React, { useState, useEffect, useContext } from 'react';
import Header from './header';
import Footer from './footer';
import { useNavigate } from 'react-router-dom';
import { AccountContext } from '../context/AccountContext';
import {ethers} from 'ethers';
import { utenteABI } from '../AddressABI/utenteABI';
import {utenteAddress} from '../AddressABI/utenteAddress';


//pagina di iscrizione alla piattaforma amethyst
//da login con valore di register = false --> arrivi qui --> una volta inserito il nick ed inviato ed effettuato correttamente l'iscrizione --> rivai di nuov alla pagina di login
function Signup() {
    const navigate = useNavigate(); 
    const {account, isRegistered} = useContext(AccountContext);
    const [nickname, setNickname] = useState('');
    const [contract, setContract] = useState(null);

    useEffect(() => {
      console.log("Account in SignUp:", account);
      console.log("isRegistered in SignUp:", isRegistered);

        // Usa BrowserProvider per interagire con Metamask
        const provider = new ethers.BrowserProvider(window.ethereum); // Usa BrowserProvider per v6
        const smart = new ethers.Contract(utenteAddress, utenteABI, provider);

        console.log("CONTRACT:", smart);

        setContract(smart);
    }, []);

    const sendDataNick = async (e) =>  {
      e.preventDefault(); 
      if (!account) return;

      console.log("Nickname inserito:", nickname);
      console.log("CONTRATTO:", contract);

      try {
        const provider = new ethers.BrowserProvider(window.ethereum); // Usa il provider di Ethereum
        const signer = await provider.getSigner(account); // Usa l'account salvato nel context

        const flag_contract = new ethers.Contract(utenteAddress, utenteABI, signer);

        const tx = await flag_contract.create_account(account, nickname);
        console.log("Transazione inviata:", tx);
        await tx.wait(); // Aspetta il completamento della transazione
        console.log("Transazione completata:", tx);
        
        const flag = await contract.get_utente_registrato(account);

        console.log("E' Registrato?", flag);
        if(flag){
          console.log("Registrazione riuscita!");
          navigate('/login');
        }else {
          console.log("Registrazione NON riuscita!");
        }
        

        
      } catch (error) {
        console.log("Errore nella chiamata della funzione", error);
        if (error.reason) {
          console.log("Messaggio errore Solidity:", error.reason); // Messaggio del require
      } else {
          console.log("Errore completo:", error);
      }
      }
    };

    const handleLogin = () => {
        navigate('/login')
      };

    return ( 
    <div className="font-pridi">
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
                  type="text" 
                  placeholder="Nickame"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
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
                  onClick={sendDataNick}
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