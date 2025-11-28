// netlify/functions/checkDoor2.js

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

  // Das richtige Passwort für Tür 2 (Lösung aus Tür 1)
  const correctPassword = "klavier";

  const isCorrect = (entered === correctPassword);

  // Nur prüfen (für die Rätselseite Tür 1)
  if (mode === "check") {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ success: isCorrect })
    };
  }

  // Modus "open": tatsächliche Tür öffnen (Inhalt von Tür 2 ausliefern)
  if (isCorrect) {
    const contentHtml = `
      <h2>Glückwunsch!</h2>
      <p>Du hast das richtige Passwort eingegeben.</p>
      <p>Hier ist dein nächstes Rätsel für Tür 3:</p>
      <p>
        Ich habe vier Beine und kann doch nicht laufen.<br>
        Ich trage Teller und Gläser bei vielen Besuchen.<br>
        Was bin ich?
      </p>
      <p><strong>Die Lösung ist das Passwort für Tür 3.</strong></p>
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
