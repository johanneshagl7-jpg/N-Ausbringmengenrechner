import React, { useState, useMemo } from 'react';
import './App.css';

export default function App() {
  const [speed, setSpeed] = useState(8);
  const [pto, setPto] = useState(540);
  const [width, setWidth] = useState(12);
  const [factor, setFactor] = useState(10);
  const [density, setDensity] = useState(0.8);
  const [nPerTon, setNPerTon] = useState(6);
  const [scraperSpeed, setScraperSpeed] = useState(50);
  const [decimals, setDecimals] = useState(1);

  const results = useMemo(() => {
    const adjustedFactor = factor * (scraperSpeed / 100);
    const volFlow = adjustedFactor * (pto / 1000);
    const haPerHour = (speed * width) / 10;
    const m3PerHa = haPerHour > 0 ? volFlow / haPerHour : 0;
    const tPerHa = m3PerHa * density;
    const kgNPerHa = tPerHa * nPerTon;

    return { adjustedFactor, volFlow, haPerHour, m3PerHa, tPerHa, kgNPerHa };
  }, [speed, pto, width, factor, density, nPerTon, scraperSpeed]);

  const fmt = (v) => Number(v).toFixed(decimals);

  return (
    <div className="container">
      <h1>N‑Ausbringungsrechner — Rindermist</h1>
      <p>Berechne live kg N/ha mit Kratzbodengeschwindigkeit, Vorschub und Zapfwelle.</p>

      <div className="grid">
        <label>Vorschub (km/h)
          <input type="number" value={speed} onChange={(e)=>setSpeed(parseFloat(e.target.value)||0)} />
        </label>
        <label>Zapfwelle (U/min)
          <input type="number" value={pto} onChange={(e)=>setPto(parseFloat(e.target.value)||0)} />
        </label>
        <label>Kratzboden (%) 
          <input type="number" value={scraperSpeed} min="0" max="150" onChange={(e)=>setScraperSpeed(parseFloat(e.target.value)||0)} />
        </label>
        <label>Arbeitsbreite (m)
          <input type="number" value={width} onChange={(e)=>setWidth(parseFloat(e.target.value)||0)} />
        </label>
        <label>Faktor (m³/h pro 1000 rpm bei 100%)
          <input type="number" value={factor} onChange={(e)=>setFactor(parseFloat(e.target.value)||0)} />
        </label>
        <label>Mist‑Dichte (t/m³)
          <input type="number" step="0.01" value={density} onChange={(e)=>setDensity(parseFloat(e.target.value)||0)} />
        </label>
        <label>Stickstoff (kg N/t)
          <input type="number" step="0.1" value={nPerTon} onChange={(e)=>setNPerTon(parseFloat(e.target.value)||0)} />
        </label>
      </div>

      <div className="results">
        <p>Effektiver Faktor: {fmt(results.adjustedFactor)}</p>
        <p>Volumenstrom (m³/h): {fmt(results.volFlow)}</p>
        <p>Hektar / h: {fmt(results.haPerHour)}</p>
        <p>m³ / ha: {fmt(results.m3PerHa)}</p>
        <p>t / ha: {fmt(results.tPerHa)}</p>
        <h2>kg N / ha: {fmt(results.kgNPerHa)}</h2>
      </div>
    </div>
  );
}