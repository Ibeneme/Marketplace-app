import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the exchange rate
const NGN_TO_USD = 1 / 1400;

// Define the context interface
interface CurrencyContextType {
  ngnToUsd: number;
  usdToNgn: number;
  showInUSD: boolean; // Add the showInUSD state
  toggleCurrency: () => void; // Add the toggleCurrency function
}

// Define props interface for CurrencyProvider
interface CurrencyProviderProps {
  children?: ReactNode;
}

// Create the context
const CurrencyContext = createContext<CurrencyContextType>({
  ngnToUsd: NGN_TO_USD,
  usdToNgn: 1 / NGN_TO_USD,
  showInUSD: true, // Initialize showInUSD to true
  toggleCurrency: () => {}, // Initialize toggleCurrency as an empty function
});

// Custom hook to access the context
export const useCurrency = () => useContext(CurrencyContext);

const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  const [ngnToUsd, setNgnToUsd] = useState<number>(NGN_TO_USD);
  const [showInUSD, setShowInUSD] = useState<boolean>(true); // Add showInUSD state

  // Function to toggle the currency display
  const toggleCurrency = () => {
    setShowInUSD(prev => !prev);
  };

  // Function to update exchange rate
  const updateExchangeRate = (newRate: number) => {
    setNgnToUsd(newRate);
  };

  const contextValue: CurrencyContextType = {
    ngnToUsd,
    usdToNgn: 1 / ngnToUsd,
    showInUSD, // Include showInUSD in the context value
    toggleCurrency, // Include toggleCurrency in the context value
  };

  return (
    <CurrencyContext.Provider value={contextValue}>
      {children}
    </CurrencyContext.Provider>
  );
};

export default CurrencyProvider;
