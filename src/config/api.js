// src/config/api.js

console.log("VITE_API_URL =", import.meta.env.VITE_API_URL);

export const API_BASE =
    import.meta.env.VITE_API_URL ||
    "https://localhost:7267";

//export const API_BASE =
//    "https://cartradingshopapi20260611195416-bnhwgrh7c3dvhpc6.swedencentral-01.azurewebsites.net";
