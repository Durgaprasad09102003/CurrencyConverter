import React, { useState, useEffect } from "react";

const CurrencyConverter = () => {
  const [amount, setAmount] = useState(0);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [conversionRate, setConversionRate] = useState(null);
  const [lastUpdated, setLastUpdated] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Comprehensive currency list with flags
  const currencies = [
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸', popular: true },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺', popular: true },
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧', popular: true },
    { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵', popular: true },
    { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺', popular: true },
    { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦', popular: true },
    { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭', popular: false },
    { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳', popular: true },
    { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳', popular: true },
    { code: 'MXN', name: 'Mexican Peso', flag: '🇲🇽', popular: false },
    { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬', popular: false },
    { code: 'NZD', name: 'New Zealand Dollar', flag: '🇳🇿', popular: false },
    { code: 'KRW', name: 'South Korean Won', flag: '🇰🇷', popular: false },
    { code: 'BRL', name: 'Brazilian Real', flag: '🇧🇷', popular: false },
    { code: 'RUB', name: 'Russian Ruble', flag: '🇷🇺', popular: false },
    { code: 'ZAR', name: 'South African Rand', flag: '🇿🇦', popular: false },
    { code: 'SEK', name: 'Swedish Krona', flag: '🇸🇪', popular: false },
    { code: 'NOK', name: 'Norwegian Krone', flag: '🇳🇴', popular: false },
    { code: 'TRY', name: 'Turkish Lira', flag: '🇹🇷', popular: false },
    { code: 'THB', name: 'Thai Baht', flag: '🇹🇭', popular: false },
    { code: 'HKD', name: 'Hong Kong Dollar', flag: '🇭🇰', popular: false },
    { code: 'IDR', name: 'Indonesian Rupiah', flag: '🇮🇩', popular: false },
    { code: 'SAR', name: 'Saudi Riyal', flag: '🇸🇦', popular: false },
    { code: 'PLN', name: 'Polish Zloty', flag: '🇵🇱', popular: false },
    { code: 'DKK', name: 'Danish Krone', flag: '🇩🇰', popular: false },
  ];

  // Function to fetch real exchange rates
  const fetchExchangeRate = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Using a free API for exchange rates
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch exchange rates');
      }
      
      const data = await response.json();
      
      if (data && data.rates && data.rates[toCurrency]) {
        const rate = data.rates[toCurrency];
        const result = (amount * rate).toFixed(2);
        
        setConvertedAmount(result);
        setConversionRate(rate.toFixed(6));
        setLastUpdated(new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString());
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error fetching exchange rates:', err);
      setError('Failed to fetch exchange rates. Using fallback rates.');
      
      // Fallback to static rates if API fails
      useFallbackRates();
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback rates in case API fails
  const useFallbackRates = () => {
    // Base rates relative to USD (as of a recent date)
    const baseRates = {
      USD: 1,
      EUR: 0.93,
      GBP: 0.80,
      JPY: 153.24,
      AUD: 1.52,
      CAD: 1.36,
      CHF: 0.91,
      CNY: 7.24,
      INR: 83.41,
      MXN: 16.75,
      SGD: 1.35,
      NZD: 1.66,
      KRW: 1335.00,
      BRL: 5.05,
      RUB: 92.50,
      ZAR: 18.70,
      SEK: 10.50,
      NOK: 10.60,
      TRY: 32.00,
      THB: 36.50,
      HKD: 7.82,
      IDR: 15650,
      SAR: 3.75,
      PLN: 4.20,
      DKK: 6.88
    };
    
    if (fromCurrency === toCurrency) {
      setConvertedAmount(parseFloat(amount).toFixed(2));
      setConversionRate(1);
      return;
    }
    
    // Convert via USD as base currency
    const amountInUSD = fromCurrency === 'USD' ? amount : amount / baseRates[fromCurrency];
    const targetAmount = toCurrency === 'USD' ? amountInUSD : amountInUSD * baseRates[toCurrency];
    
    setConvertedAmount(targetAmount.toFixed(2));
    setConversionRate((targetAmount / amount).toFixed(6));
    setLastUpdated(new Date().toLocaleDateString() + ' (fallback rates)');
  };

  // Handle conversion when button is clicked
  const handleConvert = () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    fetchExchangeRate();
  };

  // Swap currencies
  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  // Format amount with thousand separators
  const formatAmount = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-md">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">Currency Converter</h1>
              <p className="text-blue-100 mt-1">Real-time exchange rates</p>
            </div>
            <div className="bg-white text-blue-600 text-xs font-semibold px-2 py-1 rounded-md">
              Live Rates
            </div>
          </div>
        </div>
        
        {/* Converter Body */}
        <div className="p-6">
          {/* Amount Input */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Amount</label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter amount"
                min="0"
                step="0.01"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500">{fromCurrency}</span>
              </div>
            </div>
          </div>
          
          {/* Currency Selectors */}
          <div className="flex flex-col space-y-4 mb-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">From</label>
              <div className="relative">
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="w-full appearance-none border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.flag} {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Swap Button */}
            <div className="flex justify-center -my-2">
              <button
                onClick={swapCurrencies}
                className="bg-gray-200 rounded-full p-2 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Swap currencies"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </button>
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">To</label>
              <div className="relative">
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="w-full appearance-none border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.flag} {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          
          {/* Convert Button */}
          <button
            onClick={handleConvert}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium py-3 rounded-lg mb-6 hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Converting...
              </span>
            ) : (
              'Convert'
            )}
          </button>
          
          {/* Result */}
          {convertedAmount !== null && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
              <div className="text-center">
                <p className="text-gray-600 text-sm">Converted Amount</p>
                <h2 className="text-3xl font-bold text-gray-800 mt-1">
                  {formatAmount(convertedAmount)} {toCurrency}
                </h2>
                <p className="text-gray-600 text-sm mt-2">
                  1 {fromCurrency} = {conversionRate} {toCurrency}
                </p>
              </div>
            </div>
          )}
          
          {/* Last Updated */}
          <div className="text-center text-xs text-gray-500">
            {lastUpdated && <p>Rates updated on {lastUpdated}</p>}
            <p className="mt-1">💡 Tip: Always check for updated exchange rates before traveling</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;