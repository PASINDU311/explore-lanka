import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageCurrencyContext = createContext();

export const LanguageCurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => localStorage.getItem('app_currency') || 'USD');
  const [language, setLanguage] = useState(() => localStorage.getItem('app_language') || 'en');
  
  // USD to LKR Exchange Rate (1 USD = 300 LKR)
  const exchangeRate = 300;

  useEffect(() => {
    localStorage.setItem('app_currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('app_language', language);
  }, [language]);

  // USD -> LKR බවට පරිවර්තනය කරන Helper Function එක
  const formatPrice = (usdAmount) => {
    const numericFee = Number(usdAmount) || 0;
    if (numericFee === 0) return 'Free';

    if (currency === 'LKR') {
      const lkrValue = Math.round(numericFee * exchangeRate);
      return `LKR ${lkrValue.toLocaleString()}`;
    }
    return `$${numericFee}`;
  };

  return (
    <LanguageCurrencyContext.Provider 
      value={{ currency, setCurrency, language, setLanguage, formatPrice, exchangeRate }}
    >
      {children}
    </LanguageCurrencyContext.Provider>
  );
};

export const useLanguageCurrency = () => useContext(LanguageCurrencyContext);