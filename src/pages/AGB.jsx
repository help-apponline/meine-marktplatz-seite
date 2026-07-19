export default function AGB() {
  const sections = [
    { h: "1. Präambel – Unsere Grundsätze", p: `Willkommen bei help-app.online.

help-app.online ist eine digitale Vermittlungsplattform, die Menschen zusammenbringt, die Unterstützung suchen, mit Menschen, die ihre Hilfe anbieten möchten. Ziel unserer Plattform ist es, das Finden und Anbieten von Dienstleistungen einfach, transparent und sicher zu gestalten.

Unsere Plattform basiert auf den Grundwerten Vertrauen, Fairness, Respekt, Eigenverantwortung und gegenseitiger Unterstützung. Wir erwarten von allen Nutzern einen höflichen, respektvollen und verantwortungsbewussten Umgang miteinander.

help-app.online stellt ausschließlich die technische Plattform zur Verfügung, über die Auftraggeber und Auftragnehmer (Helfer) miteinander in Kontakt treten können. help-app.online vermittelt Kontakte, wird jedoch nicht selbst Vertragspartner der zwischen den Nutzern geschlossenen Vereinbarungen.

Verträge über Dienstleistungen oder sonstige Leistungen kommen ausschließlich zwischen dem jeweiligen Auftraggeber und dem jeweiligen Auftragnehmer (Helfer) zustande. Die Durchführung der vereinbarten Leistungen erfolgt eigenverantwortlich durch die beteiligten Nutzer.

help-app.online übernimmt insbesondere keine Gewähr für die Richtigkeit von Nutzerangaben, die Qualität oder den Erfolg einer vermittelten Dienstleistung, die fachliche Qualifikation eines Helfers oder die Zahlungsfähigkeit eines Auftraggebers, sofern gesetzlich nichts anderes vorgeschrieben ist.

Alle Nutzer sind verpflichtet, die geltenden Gesetze einzuhalten sowie die Rechte anderer Nutzer und Dritter zu respektieren. Die Nutzung der Plattform darf ausschließlich zu rechtmäßigen Zwecken erfolgen.

Mit der Registrierung und Nutzung von help-app.online erkennen die Nutzer die jeweils gültigen Allgemeinen Geschäftsbedingungen sowie die Datenschutzerklärung in ihrer jeweils aktuellen Fassung an.

Unser Ziel ist es, eine vertrauenswürdige Plattform zu schaffen, auf der Menschen unkompliziert Hilfe finden, Hilfe anbieten und gemeinsam von einer fairen und sicheren Vermittlung profitieren können.` },
    { h: "2. Geltungsbereich", p: "Diese Allgemeinen Geschaeftsbedingungen gelten fuer die Nutzung der Plattform help-app.online durch registrierte und nicht registrierte Nutzer." },
    { h: "3. Leistungen von help-app.online", p: "help-app.online stellt eine technische Plattform bereit, ueber die Personen Hilfeleistungen anbieten und suchen koennen. help-app.online ist nicht Partei eines Vertrages zwischen Helfer und Auftraggeber." },
    { h: "4. Registrierung und Nutzerkonto", p: "Einige Funktionen koennen eine Registrierung erfordern. Nutzer sind verpflichtet, wahrheitsgemaesse Angaben zu machen und Zugangsdaten vertraulich zu behandeln. help-app.online kann Nutzerkonten bei begruendetem Verdacht auf Missbrauch sperren." },
    { h: "5. Nutzerinhalte", p: "Nutzer sind fuer die von ihnen veroeffentlichten Inhalte allein verantwortlich. Unzulaessig sind Inhalte, die gegen Gesetze, Rechte Dritter oder die guten Sitten verstossen. help-app.online kann Inhalte bei Rechtsverletungen entfernen." },
    { h: "6. Verbotene Nutzung", p: "Es ist untersagt, die Plattform fuer Belaestigung, Betrug, Taeuschung oder Spam zu nutzen sowie technische Schutzmassnahmen zu umgehen oder rechtswidrige Inhalte einzustellen." },
    { h: "7. Verfügbarkeit", p: "help-app.online bemueht sich um hohe Verfuegbarkeit, schuldet jedoch keine ununterbrochene Erreichbarkeit. Wartungen, Sicherheitsupdates oder Stoerungen koennen zu Ausfaellen fuehren." },
    { h: "8. Haftung", p: "help-app.online haftet unbeschraenkt bei Vorsatz und grober Fahrlaessigkeit. Bei leicht fahrlässiger Verletzung wesentlicher Vertragspflichten ist die Haftung auf den vertragstypischen Schaden begrenzt." },
    { h: "9. Werbepartner", p: "Werbepartner erhalten gegen Zahlung der Jahresgebuehr einen Eintrag auf der Plattform. help-app.online uebernimmt keine Haftung fuer die Richtigkeit der Angaben von Werbepartnern." },
    { h: "10. Schlussbestimmungen", p: "Es gilt deutsches Recht. Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleiben die uebrigen Bestimmungen wirksam." },
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
            <div className="space-y-2">
              {p.split(/\n\n+/).map((para, i) => (
                <p key={i}>{para.trim()}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
