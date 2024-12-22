import React, { createContext, useState } from 'react';

// Crea il contesto
export const AccountContext = createContext();

// Provider per il contesto
export const AccountProvider = ({ children }) => {
    const [account, setAccount] = useState(null);
    const [isRegistered, setRegistered] = useState(null);

    return (
        <AccountContext.Provider value={{ account, setAccount, isRegistered, setRegistered }}>
            {children}
        </AccountContext.Provider>
    );
};
