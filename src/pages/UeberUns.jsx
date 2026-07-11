import { Link } from "react-router";
import ArrowLeft from "icon:arrow-left";
import PartnerBanner from "../components/PartnerBanner.jsx";
import Heart from "icon:heart";
import Users from "icon:users";
import MapPin from "icon:map-pin";

export default function UeberUns() {
  return (
    <section className="bg-white min-h-screen px-5 md:px-10 py-12 max-w-3xl mx-auto w-full">

      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-10"
        style={{ textDecoration: "none" }}>
        <ArrowLeft size={14} /> Zurück zur Startseite
      </Link>

      {/* Hero */}
      <div className="mb-12">
        <div className="w-12 h-12 rounded-2xl bg-[#ff8a00]/10 flex items-center justify-center mb-6">
          <Heart size={22} className="text-[#ff8a00]" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Über uns</h1>
        <p className="text-gray-600 text-lg leading-relaxed">
          Wir verbinden Menschen, die Hilfe suchen, mit Menschen, die helfen möchten —
          direkt, unkompliziert und in der Nachbarschaft.
        </p>
      </div>

      {/* Mission */}
      <div className="bg-gray-50 rounded-2xl px-6 py-6 mb-8">
        <h2 className="font-bold text-gray-900 mb-3">Unsere Mission</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Ob Gartenarbeit, Einkaufen, Umzugshilfe oder einfach eine helfende Hand —
          auf unserer Plattform finden Auftraggeber und Auftragnehmer schnell und
          einfach zueinander. Wir glauben daran, dass gegenseitige Hilfe das
          Zusammenleben in jeder Gemeinschaft stärkt.
        </p>
      </div>

      {/* Values */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <div className="border border-gray-100 rounded-2xl p-5">
          <Users size={18} className="text-[#ff8a00] mb-3" />
          <div className="font-bold text-gray-900 text-sm mb-1">Für alle</div>
          <p className="text-gray-500 text-xs leading-relaxed">
            Jeder kann mitmachen — ob jung oder alt, ob Profi oder Nachbarschaftshelfer.
            Die Registrierung ist kostenlos.
          </p>
        </div>
        <div className="border border-gray-100 rounded-2xl p-5">
          <MapPin size={18} className="text-[#ff8a00] mb-3" />
          <div className="font-bold text-gray-900 text-sm mb-1">Lokal & nah</div>
          <p className="text-gray-500 text-xs leading-relaxed">
            Wir setzen auf regionale Verbindungen — Hilfe aus der Nachbarschaft,
            nicht aus der Ferne.
          </p>
        </div>
        <div className="border border-gray-100 rounded-2xl p-5">
          <Heart size={18} className="text-[#ff8a00] mb-3" />
          <div className="font-bold text-gray-900 text-sm mb-1">Mit Herz</div>
          <p className="text-gray-500 text-xs leading-relaxed">
            Hinter jedem Auftrag steckt ein Mensch. Deshalb legen wir großen Wert
            auf Vertrauen, Respekt und gegenseitige Wertschätzung.
          </p>
        </div>
        <div className="border border-gray-100 rounded-2xl p-5">
          <div className="text-[#ff8a00] text-lg mb-3">🔒</div>
          <div className="font-bold text-gray-900 text-sm mb-1">Sicher & transparent</div>
          <p className="text-gray-500 text-xs leading-relaxed">
            Verifizierte Konten, klare Bewertungen und direkte Kommunikation —
            damit beide Seiten wissen, mit wem sie es zu tun haben.
          </p>
        </div>
      </div>

      {/* Placeholder for real content */}
      <div className="border-l-4 border-[#ff8a00] pl-4 mb-10">
        <p className="text-gray-400 text-xs italic">
          Hier kannst du deinen eigenen Text über das Unternehmen, die Geschichte
          oder das Team eintragen — einfach Bescheid geben.
        </p>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="font-bold text-gray-900 text-sm">Jetzt mitmachen</div>
          <div className="text-xs text-gray-500 mt-0.5">Kostenlos registrieren und loslegen</div>
        </div>
        <Link to="/anzeige"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ff8a00] text-white font-bold rounded-xl text-sm hover:bg-[#e67a00] transition-colors shrink-0"
          style={{ textDecoration: "none" }}>
          Anzeige aufgeben →
        </Link>
      </div>

      {/* Werbebanner ganz unten */}
      <div className="mt-10">
        <PartnerBanner />
      </div>

    </section>
  );
}
