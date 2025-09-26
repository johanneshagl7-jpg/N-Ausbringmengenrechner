import React, { useState, useMemo } from "react";
import TerrazzoCard from "./TerrazzoCard";
import "./index.css";

// einfache Zahlformatierung
const fmt = (val) => new Intl.NumberFormat("de-DE", { maximumFractionDigits: 2 }).format(val);

export default function App() {
  const [menge, setMenge] = useState(0);
  const [dichte, setDichte] = useState(1);
  const [rpm, setRpm] = useState(1000);

  // Beispielhafte Berechnung
  const ergebnis = useMemo(() => {
    if (!menge || !dichte || !rpm) return 0;
    return (menge * dichte * rpm) / 1000;
  }, [menge, dichte, rpm]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-helvetica">
      <h1 className="text-2xl font-bold mb-6">N-Ausbringungsrechner v5</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-white rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4">Eingaben</h2>
          <label className="block mb-2">
            Menge (m³)
            <input
              type="number"
              value={menge}
              onChange={(e) => setMenge(Number(e.target.value))}
              className="w-full border rounded p-2"
            />
          </label>
          <label className="block mb-2">
            Dichte (kg/m³)
            <input
              type="number"
              value={dichte}
              onChange={(e) => setDichte(Number(e.target.value))}
              className="w-full border rounded p-2"
            />
          </label>
          <label className="block mb-2">
            Drehzahl (rpm)
            <input
              type="number"
              value={rpm}
              onChange={(e) => setRpm(Number(e.target.value))}
              className="w-full border rounded p-2"
            />
          </label>
        </div>

        <div className="p-4 bg-white rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4">Ergebnis</h2>
          <p className="text-lg">Ausbringung: <b>{fmt(ergebnis)}</b></p>
        </div>
      </div>

      <div className="mt-8">
        <TerrazzoCard />
      </div>
    </div>
  );
}
