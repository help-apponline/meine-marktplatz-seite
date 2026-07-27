export default function Datenschutz() {
  const sections = [
    { h: "1. Verantwortlicher", p: "Verantwortlich im Sinne der DSGVO: [Unternehmensname / Name], [Straße Hausnummer], [PLZ Ort], E-Mail: [E-Mail-Adresse]" },
    { h: "2. Übersicht der Verarbeitungen", p: "Wir verarbeiten personenbezogene Daten, um die Plattform bereitzustellen, Anfragen zu beantworten und Nutzerkonten, Anzeigen und Kommunikation zu ermöglichen." },
    { h: "3. Zugriffsdaten / Server-Logs", p: "Beim Aufruf der Website werden durch den Hosting-Anbieter in der Regel Server-Logfiles verarbeitet. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO." },
    { h: "4. Prototyp-Hinweis", p: "In diesem Prototyp werden Funktionen (z. B. Login/Chat) überwiegend clientseitig demonstriert. Für den Livebetrieb gelten die folgenden Regelungen." },
    { h: "5. Nutzerkonto und Profil", p: "Bei Registrierung verarbeiten wir E-Mail-Adresse, Passwort-Hash und Rollenangabe. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO." },
    { h: "6. Anzeigen und Kommunikation", p: "Wenn Nutzer Anzeigen erstellen oder Nachrichten senden, verarbeiten wir die übermittelten Inhalte und Metadaten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO." },
    { h: "7. Cookies / Local Storage", p: "Wir setzen Local-Storage ein, um grundlegende Funktionen bereitzustellen (Session-Status, Anzeigen, Chats). Soweit technisch erforderlich, erfolgt dies auf Basis von § 25 Abs. 2 TTDSG." },
    { h: "8. Benachrichtigungen per E-Mail", p: `Zur Information über neue Aktivitäten auf der Plattform (z. B. den Eingang einer neuen Chatnachricht eines anderen Nutzers, Registrierungsbestätigungen, Passwort-Zurücksetzungen oder andere systemrelevante Mitteilungen) kann help-app.online automatisierte E-Mails versenden.

Hierfür werden technische Dienstleister zur Verarbeitung und Zustellung der E-Mails eingesetzt. Die Verarbeitung erfolgt ausschließlich zum Zweck der Bereitstellung der jeweiligen Funktion und auf Grundlage der geltenden datenschutzrechtlichen Bestimmungen.

Der Nutzer erklärt sich damit einverstanden, dass im Zusammenhang mit der Nutzung der Plattform automatisierte E-Mail-Benachrichtigungen versendet werden können. Diese Benachrichtigungen dienen ausschließlich der Information und können – soweit technisch und rechtlich zulässig – in den Benutzereinstellungen deaktiviert werden. Hiervon ausgenommen sind E-Mails, die für den Betrieb der Plattform oder die Vertragserfüllung erforderlich sind.` },
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
