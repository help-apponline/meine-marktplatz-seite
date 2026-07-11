export default function AGB() {
  const sections = [
    { h: "1. Geltungsbereich", p: "Diese Allgemeinen Geschaeftsbedingungen gelten fuer die Nutzung der Plattform Help App durch registrierte und nicht registrierte Nutzer." },
    { h: "2. Leistungen der Help App", p: "Help App stellt eine technische Plattform bereit, ueber die Personen Hilfeleistungen anbieten und suchen koennen. Help App ist nicht Partei eines Vertrages zwischen Helfer und Auftraggeber." },
    { h: "3. Registrierung und Nutzerkonto", p: "Einige Funktionen koennen eine Registrierung erfordern. Nutzer sind verpflichtet, wahrheitsgemaesse Angaben zu machen und Zugangsdaten vertraulich zu behandeln. Help App kann Nutzerkonten bei begruendetem Verdacht auf Missbrauch sperren." },
    { h: "4. Nutzerinhalte", p: "Nutzer sind fuer die von ihnen veroeffentlichten Inhalte allein verantwortlich. Unzulaessig sind Inhalte, die gegen Gesetze, Rechte Dritter oder die guten Sitten verstossen. Help App kann Inhalte bei Rechtsverletungen entfernen." },
    { h: "5. Verbotene Nutzung", p: "Es ist untersagt, die Plattform fuer Belaestigung, Betrug, Taeuschung oder Spam zu nutzen sowie technische Schutzmassnahmen zu umgehen oder rechtswidrige Inhalte einzustellen." },
    { h: "6. Verfuegbarkeit", p: "Help App bemueht sich um hohe Verfuegbarkeit, schuldet jedoch keine ununterbrochene Erreichbarkeit. Wartungen, Sicherheitsupdates oder Stoerungen koennen zu Ausfaellen fuehren." },
    { h: "7. Haftung", p: "Help App haftet unbeschraenkt bei Vorsatz und grober Fahrlaessigkeit. Bei leicht fahrlässiger Verletzung wesentlicher Vertragspflichten ist die Haftung auf den vertragstypischen Schaden begrenzt." },
    { h: "8. Werbepartner", p: "Werbepartner erhalten gegen Zahlung der Jahresgebuehr einen Eintrag auf der Plattform. Help App uebernimmt keine Haftung fuer die Richtigkeit der Angaben von Werbepartnern." },
    { h: "9. Schlussbestimmungen", p: "Es gilt deutsches Recht. Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleiben die uebrigen Bestimmungen wirksam." },
  ];

  return (
    <section className="bg-white min-h-screen px-5 md:px-10 py-12 max-w-4xl mx-auto w-full">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-2">AGB</h2>
      <p className="text-gray-500 mb-8">Allgemeine Geschäftsbedingungen (Vorlage für den Prototyp)</p>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-amber-800 text-sm">
        <strong>Wichtiger Hinweis:</strong> Diese AGB sind eine Vorlage und stellen keine Rechtsberatung dar. Für den Livebetrieb sollten sie angepasst und rechtlich geprüft werden.
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
