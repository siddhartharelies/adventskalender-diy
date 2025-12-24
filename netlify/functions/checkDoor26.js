// netlify/functions/checkDoor26.js

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
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, message: "Invalid JSON" })
    };
  }

  // Eingabe normalisieren
  const entered = (body.password || "").trim().toLowerCase();

  // ✅ HIER legst du das finale Kennwort fest (und optional mehrere Varianten)
  const validPasswords = [
    "Weihnachtskalenderfreude",   // Beispiel
    "weihnachtskalenderfreude"    // Beispiel englisch
  ];

  const ok = validPasswords.includes(entered);

  if (!ok) {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ success: false })
    };
  }

  // ✅ HIER steht der finale Abschlusstext (ohne Links, ohne nächste Tür)
  const finalHtml = `
    <h2>🎉 Herzlichen Glückwunsch!</h2>
    <p>Ihr habt alle Türen geöffnet und die Rätsel gemeistert.</p>
    <p><strong>Das war die finale Überraschung.</strong></p>
    <p>Wir wünschen euch wunderschöne Feiertage! 🎄</p>
  `;

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ success: true, finalHtml })
  };
};
