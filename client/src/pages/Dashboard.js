import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { gruppoAddress } from '../AddressABI/gruppoAddress';
import { gruppoABI } from '../AddressABI/gruppoABI';
import Header from './header';
import Footer from './footer';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [gruppi, setGruppi] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGruppi = async () => {
      try {
        // Collegamento al contratto
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(gruppoAddress, gruppoABI, signer);

        // Recupera i gruppi dal contratto
        const gruppiData = await contract.getGruppi();
        setGruppi(gruppiData);

        for (let i = 0; i < gruppiData.length; i++) {
          console.log("Nick name gruppo:", gruppiData[i].nick_group);
        }
      } catch (error) {
        console.error("Errore nel recupero dei gruppi:", error);
      }
    };

    fetchGruppi();
  }, []);

  const handleGroupClick = (groupId) => {
    const groupIdNumber = Number(groupId); // Converte da BigInt a Number
    console.log("ID gruppo selezionato:", groupIdNumber);
    navigate("/gruppo", { state: { groupId: groupIdNumber } }); //qui è dove vai se il login funziona correttamente sia su Amethyst e metamask
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <div className="container mx-auto py-10 mt-10">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
          Gruppi creati dalla community
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {gruppi.length > 0 ? (
            gruppi.map((gruppo, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                onClick={() => handleGroupClick(gruppo.id_gruppo)} // Gestore clic
              >
                <img
                  src={require(`./img/${gruppo.nick_group}.jpg`)}
                  alt={`${gruppo.nick_group}`}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    {gruppo.nick_group}
                  </h2>
                  <p className="text-gray-600 mt-2 text-sm">
                    {gruppo.descrizione}
                  </p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-gray-700 text-sm">
                      Likes: <strong>{gruppo.n_like}</strong>
                    </span>
                    <span className="text-gray-700 text-sm">
                      Post: <strong>{gruppo.n_post}</strong>
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center text-lg">
              Nessun gruppo disponibile
            </p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
