export default function Impressum() {
  return (
    <section className="bg-white min-h-screen px-5 md:px-10 py-12 max-w-4xl mx-auto w-full">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Impressum</h2>
      <p className="text-gray-500 mb-8">Angaben gemäß § 5 TMG und § 18 Abs. 2 MStV</p>
      <div className="max-w-3xl text-gray-600 leading-relaxed space-y-6 text-sm">

        <div>
          <h3 className="font-bold text-gray-900 mb-1">Betreiber der Plattform</h3>
          <p>
            help-app.online<br />
            Heinz-Peter Bacha<br />
            Passmannstr. 12<br />
            45899 Gelsenkirchen<br />
            Germany
          </p>
        </div>

        <div>
          <h3 className="font-bold text-gray-900 mb-1">Diensteanbieter</h3>
          <p>
            help-app.online<br />
            Inhaber: Heinz-Peter Bacha<br />
            Passmannstr. 12<br />
            45899 Gelsenkirchen<br />
            Deutschland
          </p>
        </div>

        <div>
          <h3 className="font-bold text-gray-900 mb-1">Kontakt</h3>
          <p>
            Telefon: 0209 94574476<br />
            E-Mail: <a href="mailto:info@help-app.online" className="text-[#ff8a00] underline">info@help-app.online</a>
          </p>
        </div>

        <div>
          <h3 className="font-bold text-gray-900 mb-1">Vertretungsberechtigte Person</h3>
          <p>Heinz-Peter Bacha (Inhaber)</p>
        </div>

        <div>
          <h3 className="font-bold text-gray-900 mb-1">Steuerliche Angaben</h3>
          <p>Steuernummer: <em>wird nachgereicht</em></p>
        </div>

        <div>
          <h3 className="font-bold text-gray-900 mb-1">Haftung für Inhalte</h3>
          <p>
            Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten
            nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
            Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
            Informationen zu überwachen. Bei Bekanntwerden von Rechtsverletzungen werden wir
            derartige Inhalte umgehend entfernen.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-gray-900 mb-1">Haftung für Links</h3>
          <p>
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen
            Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr
            übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder
            Betreiber der Seiten verantwortlich.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-gray-900 mb-1">Urheberrecht</h3>
          <p>
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen
            dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art
            der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen
            Zustimmung des jeweiligen Autors. Downloads und Kopien dieser Seite sind nur für den
            privaten, nicht kommerziellen Gebrauch gestattet.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-gray-900 mb-1">Streitschlichtung</h3>
          <p>
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
            <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer"
              className="text-[#ff8a00] underline">
              https://ec.europa.eu/consumers/odr
            </a>.<br />
            Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </div>

      </div>
    </section>
  );
}
