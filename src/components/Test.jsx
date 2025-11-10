import React, { useState } from "react";
import apiClient from "../api.js";

export default function Test() {
  const [travelType, setTravelType] = useState([]);
  const [budgets, setBudget] = useState([]);
  const [places, setPlace] = useState([]);
  const [err, setErr] = useState("");

  const callTypes = async () => {
    try {
      setErr("");
      const { data } = await apiClient.get("/api/v1/meta/travel-types");
      setTravelType(Array.isArray(data?.items) ? data.items : []);
      console.log(data);
    } catch (e) {
      setErr(e?.response?.data?.detail || e.message);
    }
  };


  const callBudgets = async () => {
    try {
      setErr("");
      const { data } = await apiClient.get("/api/v1/meta/budgets");
      setBudget(Array.isArray(data?.items) ? data.items : []);
      console.log(data);
    } catch (e) {
      setErr(e?.response?.data?.detail || e.message);
    }
  }

  const callPlaces = async () => {
    try {
      setErr("");
      const { data } = await apiClient.get("/api/v1/places/search?q=Berlin");
      // adjust according to API shape; here we just show the count
      setPlace(data);
      console.log(data);
    } catch (e) {
      setErr(e?.response?.data?.detail || e.message);
    }
  };

  return (
    <div className="p-4">
      <div className="flex gap-3">
        <button className="bg-amber-500 text-white px-4 py-2 rounded" onClick={callTypes}>
          Get Travel Types
        </button>
        <button className="bg-teal-600 text-white px-4 py-2 rounded" onClick={callPlaces}>
          Get Plans
        </button>
        <button className="bg-purple-600 text-white px-4 py-2 rounded" onClick={callBudgets}>
          Get Budgets
        </button>
      </div>

      {err && <div className="mt-4 text-red-600">{err}</div>}

      <ul className="mt-4 space-y-2">
        {travelType.map((t) => (
          <li key={t.id} className="p-2 border rounded">
            <p>{t.icon}</p>
            <h3>{t.label}</h3>
            <p>{t.description}</p>
          </li>
        ))}
      </ul>
      <ul className="mt-4 space-y-2">
        {places.map((t,idx) => (
          <li key={idx} className="p-2 border rounded">
            <h3>{t.name}</h3>
          </li>
        ))}
      </ul>
      <ul className="mt-4 space-y-2">
        {budgets.map((t) => (
          <li key={t.id} className="p-2 border rounded">
            <h3>{t.label}</h3>
          </li>
        ))}
      </ul>
    </div>
  );
}
