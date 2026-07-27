export default function Datenschutz() {
  const sections = [
    { h: "1. Verantwortlicher", p: `Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) sowie sonstiger datenschutzrechtlicher Bestimmungen ist:

help-app.online

Betreiber / Diensteanbieter
Heinz-Peter Bacha
Passmannstr. 12
45899 Gelsenkirchen
Deutschland

Telefon: +49 (0)209 94574476
E-Mail: info@help-app.online

Vertretungsberechtigte Person:
Heinz-Peter Bacha (Inhaber)

Steuernummer: 319/5029/5935` },
    { h: "2. Übersicht der Verarbeitungen", p: "Wir verarbeiten personenbezogene Daten, um die Plattform bereitzustellen, Anfragen zu beantworten und Nutzerkonten, Anzeigen und Kommunikation zu ermöglichen." },
    { h: "3. Zugriffsdaten / Server-Logs", p: "Beim Aufruf der Website werden durch den Hosting-Anbieter in der Regel Server-Logfiles verarbeitet. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO." },
    { h: "4. Prototyp-Hinweis", p: "In diesem Prototyp werden Funktionen (z. B. Login/Chat) überwiegend clientseitig demonstriert. Für den Livebetrieb gelten die folgenden Regelungen." },
    { h: "5. Nutzerkonto und Profil", p: "Bei Registrierung verarbeiten wir E-Mail-Adresse, Passwort-Hash und Rollenangabe. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO." },
    { h: "6. Anzeigen und Kommunikation", p: "Wenn Nutzer Anzeigen erstellen oder Nachrichten senden, verarbeiten wir die übermittelten Inhalte und Metadaten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO." },
    { h: "7. Cookies / Local Storage", p: "Wir setzen Local-Storage ein, um grundlegende Funktionen bereitzustellen (Session-Status, Anzeigen, Chats). Soweit technisch erforderlich, erfolgt dies auf Basis von § 25 Abs. 2 TTDSG." },
    { h: "8. Benachrichtigungen und Kommunikation", p: `help-app.online informiert Nutzer über wichtige Ereignisse im Zusammenhang mit der Nutzung der Plattform. Hierzu gehören insbesondere Benachrichtigungen über neue Chatnachrichten, Auftragsanfragen, Änderungen des Auftragsstatus, Bewertungen, sicherheitsrelevante Mitteilungen sowie weitere für die Nutzung der Plattform erforderliche Informationen.

Die Benachrichtigungen können per E-Mail oder über andere innerhalb der Plattform bereitgestellte Kommunikationswege erfolgen.

Zur technischen Abwicklung und Zustellung der E-Mail-Benachrichtigungen kann help-app.online externe technische Dienstleister einsetzen. Die Verarbeitung erfolgt ausschließlich zum Zweck der Bereitstellung der jeweiligen Funktion und unter Beachtung der geltenden datenschutzrechtlichen Bestimmungen. Weitere Informationen hierzu sind der Datenschutzerklärung zu entnehmen.

Der Nutzer ist verpflichtet, eine gültige E-Mail-Adresse anzugeben und diese regelmäßig abzurufen. Soweit Benachrichtigungen nicht gesetzlich oder vertraglich erforderlich sind, können diese – sofern technisch vorgesehen – vom Nutzer in den Kontoeinstellungen verwaltet oder deaktiviert werden.` },
    { h: "9. Deine Rechte", p: "Du hast das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch (Art. 21). Wende dich dazu an: info@help-app.online" },
    { h: "10. Speicherdauer", p: "Wir speichern Daten nur so lange, wie es für die genannten Zwecke erforderlich ist oder gesetzliche Aufbewahrungspflichten bestehen." },
    { h: "11. Beschwerderecht", p: "Du hast das Recht, dich bei einer Datenschutzaufsichtsbehörde zu beschweren. Die zuständige Behörde richtet sich nach deinem Wohnsitz oder dem Sitz unseres Unternehmens." },
  ];

  return (
    <section className="bg-white min-h-screen px-5 md:px-10 py-12 max-w-4xl mx-auto w-full">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Datenschutz</h2>
      <p className="text-gray-500 mb-8">Datenschutzerklärung (Vorlage für den Prototyp)</p>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-amber-800 text-sm">
        <strong>Wichtiger Hinweis:</strong> Diese Datenschutzerklärung ist eine Vorlage und keine Rechtsberatung. Für den Livebetrieb muss sie an die tatsächlichen Datenflüsse angepasst werden.
      </div>
      <div className="max-w-3xl text-gray-600 leading-relaxed space-y-6 text-sm">
        {sections.map(({ h, p }) => (
          <div key={h}>
            <h3 className="font-bold text-gray-900 mb-1">{h}</h3>
            <p>{p}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
