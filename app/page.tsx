"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<number | "">("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [exchangeRates, setExchangeRates] = useState<{ [key: string]: number }>({});
  const [convertedAmount, setConvertedAmount] = useState("");

  const API_KEY = "YOUR_API_KEY"; // Replace with your API key
  const API_URL = `https://open.er-api.com/v6/latest/USD`;

  useEffect(() => {
    axios.get(API_URL)
      .then(response => {
        setExchangeRates(response.data.rates);
      })
      .catch(error => console.error("Error fetching exchange rates:", error));
  }, []);

  const convertCurrency = () => {
    if (!amount || amount <= 0) {
      setConvertedAmount("⚠ Enter a valid amount");
      return;
    }

    const fromRate = exchangeRates[fromCurrency];
    const toRate = exchangeRates[toCurrency];

    if (fromRate && toRate) {
      const result = (amount * toRate) / fromRate;
      setConvertedAmount(`${amount} ${fromCurrency} = ${result.toFixed(2)} ${toCurrency}`);
    }
  };

  const switchCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gradient-to-br from-gray-900 to-gray-700">
      <div className="bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-2xl shadow-xl w-[400px] text-center border border-gray-500">
        <h2 className="text-black text-3xl font-bold mb-6">💱 Currency Converter</h2>

        <input 
          type="number" 
          value={amount} 
          onChange={(e) => setAmount(Number(e.target.value) || "")} 
          placeholder="Enter amount" 
          className="w-full p-4 rounded-xl text-white bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
        />

        <div className="flex justify-between items-center space-x-4 mt-6">
          <select 
            value={fromCurrency} 
            onChange={(e) => setFromCurrency(e.target.value)}
            className="w-1/3 p-4 rounded-xl text-white bg-gray-800 border border-gray-600 focus:outline-none appearance-none cursor-pointer"
          >
            {Object.keys(exchangeRates).map(currency => (
              <option key={currency} value={currency} className="text-white">{currency}</option>
            ))}
          </select>

          <button 
            onClick={switchCurrencies} 
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full transition-all transform hover:rotate-180"
          >
            🔄
          </button>

          <select 
            value={toCurrency} 
            onChange={(e) => setToCurrency(e.target.value)}
            className="w-1/3 p-4 rounded-xl text-white bg-gray-800 border border-gray-600 focus:outline-none appearance-none cursor-pointer"
          >
            {Object.keys(exchangeRates).map(currency => (
              <option key={currency} value={currency} className="text-white">{currency}</option>
            ))}
          </select>
        </div>

        <button 
          onClick={convertCurrency} 
          className="w-full mt-6 p-4 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:scale-105 transition-all"
        >
          Convert
        </button>

        <p className="mt-6 text-white text-xl font-semibold bg-gray-800 p-4 rounded-xl">
          {convertedAmount || "Converted amount will appear here"}
        </p>
      </div>
    </div>
  );
}
