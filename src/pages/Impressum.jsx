export default function Impressum() {
  return (
    <section className="bg-white min-h-screen px-5 md:px-10 py-12 max-w-4xl mx-auto w-full">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Impressum</h2>
      <p className="text-gray-500 mb-8">Angaben gemäß § 5 TMG und § 18 Abs. 2 MStV</p>
      <div className="max-w-3xl text-gray-600 leading-relaxed space-y-6 text-sm">
        <div>
          <h3 className="font-bold text-gray-900 mb-1">Diensteanbieter</h3>
          <p>[Unternehmensname / Name]<br />[Straße Hausnummer]<br />[PLZ Ort]<br />[Land]</p>
        </div>
        <div>
          <h3 className="font-bold text-gray-900 mb-1">Kontakt</h3>
          <p>Telefon: [Telefonnummer]<br />E-Mail: [E-Mail-Adresse]</p>
        </div>
        <div>
          <h3 className="font-bold text-gray-900 mb-1">Vertretungsberechtigte Person(en)</h3>
          <p>[Geschäftsführer/in / Inhaber/in]</p>
        </div>
        <div>
          <h3 className="font-bold text-gray-900 mb-1">Umsatzsteuer</h3>
          <p>Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: [USt-IdNr.]</p>
        </div>
        <div>
          <h3 className="font-bold text-gray-900 mb-1">Haftung für Inhalte</h3>
          <p>Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen.</p>
        </div>
        <div>
          <h3 className="font-bold text-gray-900 mb-1">Urheberrecht</h3>
          <p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors.</p>
        </div>
        <p className="text-xs text-gray-400 mt-8 border-t border-gray-100 pt-4">
          Hinweis: Diese Seite ist eine Vorlage. Bitte ersetze die Platzhalter durch deine echten Angaben.
        </p>
      </div>
    </section>
  );
}
