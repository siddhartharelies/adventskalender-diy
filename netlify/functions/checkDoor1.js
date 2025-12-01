// netlify/functions/checkDoor1.js

// Hilfsfunktion: aktuelles Datum in Europe/Berlin als "YYYY-MM-DD"
function getTodayInBerlin() {
  const now = new Date();

  // Zeit in Europe/Berlin "umrechnen"
  const berlinNow = new Date(
    now.toLocaleString("en-US", { timeZone: "Europe/Berlin" })
  );

  const year = berlinNow.getFullYear();
  const month = String(berlinNow.getMonth() + 1).padStart(2, "0");
  const day = String(berlinNow.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`; // z.B. "2025-12-02"
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, message: "Method not allowed" })
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, message: "Invalid JSON" })
    };
  }

  const entered = (body.password || "").trim().toLowerCase();
  const mode = (body.mode || "open").toLowerCase(); // "check" oder "open"

  // 1) Passwort für Tür 2 (Lösung aus Tür 1)
  const validPasswords = [
  "heiligerAbend",   // deutsch
  "heiligabend"      // englisch
];
// Prüfen, ob eine der erlaubten Varianten passt
const isCorrect = validPasswords.includes(entered);
  
  // 2) Mindestdatum für das Öffnen von Tür 2
  const minDate = "2025-12-01"; // im Format YYYY-MM-DD
  const today = getTodayInBerlin();

  // const isCorrect = (entered === correctPassword);

  // ---- Modus "check": nur prüfen, ob Lösung stimmt, Datum egal ----
  if (mode === "check") {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ success: isCorrect })
    };
  }

  // ---- Modus "open": Tür wirklich öffnen ----
  // Zuerst Datum prüfen
  if (today < minDate) {
    // Noch zu früh für diese Tür
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        success: false,
        tooEarly: true,
        availableFrom: minDate
      })
    };
  }

  // Datum passt, jetzt Passwort prüfen
  if (isCorrect) {
    const contentHtml = `
      <h2>Glückwunsch!</h2>
      <p>Du hast das richtige Passwort eingegeben.</p>
      <p>Hier ist dein nächstes Rätsel für Tür 2:</p>
      <p>
        Ich habe vier Beine und kann doch nicht laufen.<br>
        Ich trage Teller und Gläser bei vielen Besuchen.<br>
        Was bin ich?
      </p>
      <p><strong>Die Lösung ist das Passwort für Tür 2.</strong></p>
      <p><em>Gutschein-Fragment: BUCHSTABE 1 = G</em></p>
    `;

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ success: true, contentHtml })
    };
  } else {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ success: false })
    };
  }
};
