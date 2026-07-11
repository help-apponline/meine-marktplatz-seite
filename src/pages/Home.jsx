import { Link } from "react-router";
import PartnerBanner from "../components/PartnerBanner.jsx";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="bg-white text-center px-6 pt-14 pb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4">
          Finde Hilfe. Werde Helfer.
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
          Die Help App verbindet Menschen, die Unterstützung suchen, mit Helfern aus der Nähe – schnell und unkompliziert.
        </p>
      </section>

      {/* Cards */}
      <section className="px-5 md:px-10 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto w-full">
        {[
          { emoji: "🛠️", label: "Angebote", to: "/angebote" },
          { emoji: "🔍", label: "Gesuche", to: "/gesuche" },
          { emoji: "📝", label: "Anzeige kostenlos aufgeben", to: "/anzeige" },
          { emoji: "🤝", label: "Werbepartner-Bereich", to: "/werbepartner" },
        ].map(({ emoji, label, to }) => (
          <Link
            key={to}
            to={to}
            className="bg-white rounded-2xl p-8 text-center shadow hover:shadow-lg hover:-translate-y-1 transition-all text-gray-900"
            style={{ textDecoration: "none" }}
          >
            <div className="text-5xl mb-5">{emoji}</div>
            <h3 className="text-lg font-bold">{label}</h3>
          </Link>
        ))}
      </section>

      <div className="px-5 max-w-6xl mx-auto w-full mb-10">
        <PartnerBanner />
      </div>
    </>
  );
}
