import React, { useState, useEffect } from "react";

export default function NRechner() {
  const [fläche, setFläche] = useState("");
  const [menge, setMenge] = useState("");
  const [nGehalt, setNGehalt] = useState("");
  const [faktor, setFaktor] = useState(10); // m³/ha bei 1000 rpm
  const [ergebnis, setErgebnis] = useState(null);
  const [history, setHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedHistory = localStorage.getItem("nHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme) {
      setDarkMode(savedTheme === "true");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const calc = (e) => {
    e.preventDefault();

    const fl = parseFloat(fläche);
    const m = parseFloat(menge);
    const n = parseFloat(nGehalt);
    const f = parseFloat(faktor);

    if (isNaN(fl) || isNaN(m) || isNaN(n) || isNaN(f) || fl <= 0) {
      setErgebnis("⚠️ Bitte gültige Werte eingeben!");
      return;
    }

    const gesamtN = m * f * (n / 100); // kg N insgesamt
    const nProHa = gesamtN / fl;       // kg N pro ha

    let text = `Zufuhr: ${nProHa.toFixed(1)} kg N/ha`;
    if (nProHa > 170) {
      text += " 🚨 Grenzwert überschritten!";
    }

    setErgebnis(text);

    const newEntry = {
      fläche: fl,
      menge: m,
      faktor: f,
      nGehalt: n,
      nProHa: nProHa.toFixed(1),
      date: new Date().toLocaleString("de-AT")
    };

    const newHistory = [newEntry, ...history].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem("nHistory", JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    localStorage.removeItem("nHistory");
    setHistory([]);
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "20px auto",
        fontFamily: "sans-serif",
        backgroundColor: darkMode ? "#121212" : "#fff",
        color: darkMode ? "#eee" : "#000",
        padding: "20px",
        borderRadius: "10px"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>N-Ausbringungsrechner</h2>
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️ Hell" : "🌙 Dunkel"}
        </button>
      </div>

      <form onSubmit={calc}>
        <div>
          <label>Schlaggröße (ha):</label>
          <input type="number" step="0.01" value={fläche} onChange={(e) => setFläche(e.target.value)} />
        </div>
        <div>
          <label>Ausgebrachte Menge (t oder m³):</label>
          <input type="number" step="0.01" value={menge} onChange={(e) => setMenge(e.target.value)} />
        </div>
        <div>
          <label>N-Gehalt (%):</label>
          <input type="number" step="0.01" value={nGehalt} onChange={(e) => setNGehalt(e.target.value)} />
        </div>
        <div>
          <label>Faktor (m³/ha @ 1000 rpm): {faktor}</label>
          <input
            type="range"
            min="10"
            max="160"
            step="1"
            value={faktor}
            onChange={(e) => setFaktor(e.target.value)}
          />
        </div>
        <button type="submit">Berechnen</button>
      </form>

      {ergebnis && <p style={{ marginTop: "10px", fontWeight: "bold" }}>{ergebnis}</p>}

      {history.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Gespeicherte Berechnungen</h3>
          <ul>
            {history.map((h, idx) => (
              <li key={idx}>
                {h.date}: {h.nProHa} kg N/ha (Fläche: {h.fläche} ha, Menge: {h.menge}, Faktor: {h.faktor}, N: {h.nGehalt}%)
              </li>
            ))}
          </ul>
          <button onClick={clearHistory}>Verlauf löschen</button>
        </div>
      )}
    </div>
  );
}
