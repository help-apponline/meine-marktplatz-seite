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

      {/* Die Idee */}
      <div className="space-y-5 text-gray-700 text-sm leading-relaxed mb-10">
        <h2 className="text-xl font-extrabold text-gray-900">Die Idee hinter der Help App</h2>

        <p>Die Idee zur Help App ist nicht am Schreibtisch entstanden, sondern aus dem ganz normalen Alltag.</p>

        <p>Immer wieder gab es Situationen, in denen wir selbst kurzfristig Hilfe gebraucht haben. Mal musste etwas transportiert werden, mal fehlte jemand für eine kleine handwerkliche Aufgabe oder es war einfach niemand da, der beim Einkaufen oder im Garten helfen konnte. Gleichzeitig haben wir uns oft gedacht: <strong>Eigentlich könnten wir anderen in genau solchen Situationen selbst helfen.</strong></p>

        <p>Ich selbst hätte zum Beispiel kein Problem damit, mit einem Hund Gassi zu gehen, einen kleinen Transport zu übernehmen oder jemandem den Einkauf nach Hause zu bringen. An Tagen, an denen ich Zeit habe und nichts geplant ist, wäre es doch schön, diese Zeit sinnvoll zu nutzen, anderen zu helfen und sich gleichzeitig ein kleines Taschengeld dazuzuverdienen.</p>

        <p>Als ich mit Freunden darüber gesprochen habe, wurde mir schnell klar, dass ich damit nicht allein bin. Ein Bekannter wäscht in seiner Freizeit gerne Autos und hätte nichts dagegen, dies auch für andere zu tun. Ein anderer arbeitet gerne im Garten und mäht mit Freude Rasen. Wieder jemand anderes hilft gerne beim Möbelaufbau oder übernimmt kleine Reparaturen.</p>

        <p>So entstand die Frage:</p>

        <div className="border-l-4 border-[#ff8a00] pl-4 py-1">
          <p className="font-bold text-gray-900"><strong>Warum gibt es keine einfache Plattform, auf der Menschen genau diese Hilfe anbieten oder finden können?</strong></p>
        </div>

        <p>Nicht jeder möchte einen großen Handwerksbetrieb beauftragen oder lange im Internet suchen. Oft geht es um kleine Aufgaben, die schnell erledigt werden könnten – von Menschen aus der eigenen Region.</p>

        <p>Genau daraus entstand die Help App.</p>

        <p>Unsere Vision ist es, Menschen unkompliziert zusammenzubringen. Jeder soll schnell Hilfe finden oder selbst Helfer werden können. Manche möchten sich etwas dazuverdienen, andere helfen einfach gerne oder möchten ihre freie Zeit sinnvoll nutzen. Beides hat bei uns seinen Platz.</p>

        <p>Denn wir sind überzeugt: Fast jeder Mensch kann etwas besonders gut – und genau diese Fähigkeiten können für jemand anderen eine große Hilfe sein.</p>

        <p>Mit der Help App möchten wir Nachbarschaftshilfe, kleine Dienstleistungen und spontane Unterstützung einfacher, schneller und moderner machen. So profitieren am Ende alle: Diejenigen, die Hilfe benötigen, und diejenigen, die ihre Zeit, ihr Können oder ihre Erfahrung einbringen möchten.</p>
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
