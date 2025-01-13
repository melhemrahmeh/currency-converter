import React, { useState, useEffect } from "react";

const App = () => {
  const [currencies, setCurrencies] = useState([]);
  const [rates, setRates] = useState({});
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [result, setResult] = useState(0);
  const [error, setError] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    fetchExchangeRates();
    const interval = setInterval(fetchExchangeRates, 300000); // Refresh data every 5 minutes (300000 ms)
    return () => clearInterval(interval); // Clean up interval on component unmount
  }, []);

  useEffect(() => {
    if (amount > 0 && rates[fromCurrency] && rates[toCurrency]) {
      convert();
    }
  }, [amount, fromCurrency, toCurrency]);

  const fetchExchangeRates = async () => {
    try {
      const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
      const data = await response.json();
      setCurrencies(Object.keys(data.rates));
      setRates(data.rates);
      setResult(((amount / data.rates[fromCurrency]) * data.rates[toCurrency]).toFixed(2)); // Update result
      setError("");
    } catch (error) {
      setError("Failed to fetch exchange rates. Try again later.");
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
    document.documentElement.classList.toggle("dark");
  };

  const convert = () => {
    const fromRate = rates[fromCurrency];
    const toRate = rates[toCurrency];
    setResult(((amount / fromRate) * toRate).toFixed(2));
  };

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const getFlagUrl = (currency) => {
    const code = currency.slice(0, 2).toUpperCase();
    return `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 dark:text-white p-12 rounded shadow-lg w-full max-w-2xl">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <img
              src="https://img.icons8.com/fluency/48/exchange.png"
              alt="Currency Converter Icon"
              className="w-8 h-8"
            />
            <h1 className="text-3xl font-bold">Currency Converter</h1>
          </div>
          <button
            onClick={toggleDarkMode}
            className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
          >
            {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 mb-4 rounded text-sm">
            {error}
          </div>
        )}

        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-lg"
          />
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1">
            <label className="block mb-2 text-sm font-medium">From</label>
            <div className="relative">
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-lg appearance-none"
              >
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
              <div className="absolute top-1/2 left-3 transform -translate-y-1/2 flex items-center">
                <img
                  src={getFlagUrl(fromCurrency)}
                  alt={fromCurrency}
                  className="w-6 h-6"
                />
              </div>
            </div>
          </div>

          <button
            onClick={swapCurrencies}
            className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 p-3 rounded"
            aria-label="Swap currencies"
          >
            ↔️
          </button>

          <div className="flex-1">
            <label className="block mb-2 text-sm font-medium">To</label>
            <div className="relative">
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-lg appearance-none"
              >
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
              <div className="absolute top-1/2 left-3 transform -translate-y-1/2 flex items-center">
                <img
                  src={getFlagUrl(toCurrency)}
                  alt={toCurrency}
                  className="w-6 h-6"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={fetchExchangeRates}
          className="w-full bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-all duration-300 text-lg font-semibold shadow-md mb-6"
        >
          Refresh Rates
        </button>

        {result > 0 && (
          <div className="mt-8 text-center bg-gray-50 dark:bg-blue-700 border border-gray-200 dark:border-blue-800 p-6 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
              {amount} {fromCurrency} =
            </h2>
            <h2 className="text-4xl font-extrabold text-blue-600 dark:text-blue-200 mt-2">
              {result} {toCurrency}
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
