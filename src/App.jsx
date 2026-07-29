import { Routes, Route } from "react-router";
import { AuthProvider } from "./context/AuthContext.jsx";
import { FavoritesProvider } from "./context/FavoritesContext.jsx";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Angebote from "./pages/Angebote.jsx";
import Gesuche from "./pages/Gesuche.jsx";
import Anzeige from "./pages/Anzeige.jsx";
import Detail from "./pages/Detail.jsx";
import Inbox from "./pages/Inbox.jsx";
import Chat from "./pages/Chat.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Werbepartner from "./pages/Werbepartner.jsx";
import Admin from "./pages/Admin.jsx";
import Profil from "./pages/Profil.jsx";
import Merkliste from "./pages/Merkliste.jsx";
import HelferProfil from "./pages/HelferProfil.jsx";
import Suche from "./pages/Suche.jsx";
import PartnerProfil from "./pages/PartnerProfil.jsx";
import UeberUns from "./pages/UeberUns.jsx";
import Impressum from "./pages/Impressum.jsx";
import Datenschutz from "./pages/Datenschutz.jsx";
import AGB from "./pages/AGB.jsx";
import Feedback from "./pages/Feedback.jsx";
import CookieBanner from "./components/CookieBanner.jsx";

function NotFound() {
  return (
    <section className="bg-white min-h-screen flex items-center justify-center px-5">
      <div className="text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">404</h2>
        <p className="text-gray-500 mb-6">Seite nicht gefunden.</p>
        <a href="/" className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-700 transition-colors" style={{ textDecoration: "none" }}>
          Zur Startseite
        </a>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/angebote" element={<Angebote />} />
            <Route path="/gesuche" element={<Gesuche />} />
            <Route path="/anzeige" element={<Anzeige />} />
            <Route path="/detail/:id" element={<Detail />} />
            <Route path="/detail" element={<Detail />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/chat/:chatId" element={<Chat />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/werbepartner" element={<Werbepartner />} />
            <Route path="/partner/:id" element={<PartnerProfil />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/profil" element={<Profil />} />
            <Route path="/merkliste" element={<Merkliste />} />
            <Route path="/helfer/:userId" element={<HelferProfil />} />
            <Route path="/suche" element={<Suche />} />
            <Route path="/ueber-uns" element={<UeberUns />} />
            <Route path="/impressum" element={<Impressum />} />
            <Route path="/datenschutz" element={<Datenschutz />} />
            <Route path="/agb" element={<AGB />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </FavoritesProvider>
      <CookieBanner />
    </AuthProvider>
  );
}
