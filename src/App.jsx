import React, { useState, useMemo, useEffect } from 'react';

export default function NAusbringungsRechner() {
  const [speed, setSpeed] = useState(8);
  const [pto, setPto] = useState(540);
  const [width, setWidth] = useState(12);
  const [overlap, setOverlap] = useState(50);
  const [factor, setFactor] = useState(10);
  const [density, setDensity] = useState(0.8);
  const [nPerTon, setNPerTon] = useState(6);
  const [scraperSpeed, setScraperSpeed] = useState(50);
  const [decimals, setDecimals] = useState(1);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.style.background = dark ? '#0f172a' : '#f8fafc';
  }, [dark]);

  const results = useMemo(() => {
    const effectiveWidth = width * (1 - overlap / 100);
    const adjustedFactor = factor * (scraperSpeed / 100);
    const volFlow = adjustedFactor * (pto / 1000);
    const haPerHour = effectiveWidth > 0 ? (speed * effectiveWidth) / 10 : 0;
    const m3PerHa = haPerHour > 0 ? volFlow / haPerHour : 0;
    const tPerHa = m3PerHa * density;
    const kgNPerHa = tPerHa * nPerTon;
    return { effectiveWidth, adjustedFactor, volFlow, haPerHour, m3PerHa, tPerHa, kgNPerHa };
  }, [speed, pto, width, overlap, factor, density, nPerTon, scraperSpeed]);

  const fmt = (v) => Number(v).toFixed(decimals);

  const containerStyle = { color: dark ? '#e6eef8' : '#0f172a' };
  const cardStyle = {
    background: dark ? '#0b1220' : '#ffffff',
    border: `1px solid ${dark ? '#233044' : '#e6e9ef'}`,
    padding: '16px',
    borderRadius: '8px',
  };

  return (
    <div style={{ maxWidth: 900, margin: '20px auto', fontFamily: 'Inter, system-ui, sans-serif', ...containerStyle }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontWeight: 800, fontSize: 20, color: '#d32f2f' }}>TEBBE</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>N‑Ausbringungsrechner — Rindermist</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <label style={{ fontSize: 14 }}>{dark ? 'Dark' : 'Light'}</label>
          <button onClick={() => setDark(d => !d)} style={{ padding: '6px 10px', borderRadius: 6, cursor: 'pointer', border: 'none', background: dark ? '#334155' : '#e2e8f0' }}>{dark ? '🌙' : '☀️'}</button>
        </div>
      </header>

      <main style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16 }}>
        <section style={cardStyle}>
          <p style={{ marginTop: 0, marginBottom: 12 }}>Berechne live kg N/ha mit Kratzbodengeschwindigkeit, Vorschub, Zapfwelle und Überlappung.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <label>Vorschub (km/h)<input type="number" value={speed} onChange={(e)=>setSpeed(parseFloat(e.target.value)||0)} /></label>
            <label>Zapfwelle (U/min)<input type="number" value={pto} onChange={(e)=>setPto(parseFloat(e.target.value)||0)} /></label>
            <label>Kratzboden (%)<input type="number" value={scraperSpeed} onChange={(e)=>setScraperSpeed(parseFloat(e.target.value)||0)} /></label>
            <label>Arbeitsbreite (m)<input type="number" value={width} onChange={(e)=>setWidth(parseFloat(e.target.value)||0)} /></label>
            <label>Überlappung (%)<input type="number" value={overlap} onChange={(e)=>setOverlap(parseFloat(e.target.value)||0)} /></label>
            <label>Faktor (m³/h pro 1000 rpm)<input type="number" value={factor} onChange={(e)=>setFactor(parseFloat(e.target.value)||0)} /></label>
            <label>Mist‑Dichte (t/m³)<input type="number" step="0.01" value={density} onChange={(e)=>setDensity(parseFloat(e.target.value)||0)} /></label>
            <label>Stickstoff (kg N/t)<input type="number" step="0.1" value={nPerTon} onChange={(e)=>setNPerTon(parseFloat(e.target.value)||0)} /></label>
          </div>
        </section>

        <aside style={cardStyle}>
          <h3>Ergebnisse</h3>
          <div>Effektive Arbeitsbreite: {fmt(results.effectiveWidth)} m</div>
          <div>Effektiver Faktor: {fmt(results.adjustedFactor)}</div>
          <div>Volumenstrom: {fmt(results.volFlow)} m³/h</div>
          <div>Hektar / h: {fmt(results.haPerHour)}</div>
          <div>m³ / ha: {fmt(results.m3PerHa)}</div>
          <div>t / ha: {fmt(results.tPerHa)}</div>
          <h2>kg N / ha: {fmt(results.kgNPerHa)}</h2>
        </aside>
      </main>

      <footer style={{ position: 'fixed', right: 12, bottom: 12, fontSize: 12 }}>Programmiert von Johannes Hagl.</footer>
    </div>
  );
}
