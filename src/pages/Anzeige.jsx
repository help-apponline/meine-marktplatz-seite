import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";
import PartnerBanner from "../components/PartnerBanner.jsx";

export default function Anzeige() {
  const { loggedIn, userRole, userEmail, loadAds, saveAds, uid } = useAuth();
  const [name, setName] = useState("");
  const [need, setNeed] = useState("");
  const [when, setWhen] = useState("");
  const [budget, setBudget] = useState("");
  const [skills, setSkills] = useState("");
  const [helperWhen, setHelperWhen] = useState("");
  const [radius, setRadius] = useState("");
  const [zip, setZip] = useState("");
  const [city, setCity] = useState("");
  const [price, setPrice] = useState("");
  const [preisart, setPreisart] = useState("");
  const [desc, setDesc] = useState("");
  const [myAds, setMyAds] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (loggedIn) {
      setMyAds(loadAds().filter(a => a.owner === userEmail));
    }
  }, [loggedIn, userEmail]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!loggedIn) {
      if (window.__helpAppRequireLogin) window.__helpAppRequireLogin("Bitte logge dich ein, um eine Anzeige zu veröffentlichen.");
      return;
    }
    const title = userRole === "helper" ? (skills || "Hilfe anbieten") : (need || "Hilfe gesucht");
    const chosenWhen = userRole === "helper" ? helperWhen : when;
    const ad = {
      id: uid(),
      owner: userEmail,
      role: userRole,
      name, zip, city, title,
      when: chosenWhen,
      price, preisart,
      priceLabel: price ? `${price} (${preisart || "—"})` : (preisart || "—"),
      desc,
      status: "offen",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const list = loadAds();
    list.push(ad);
    saveAds(list);
    setMyAds(list.filter(a => a.owner === userEmail));
    setMsg("Anzeige veröffentlicht!");
    setName(""); setNeed(""); setWhen(""); setBudget(""); setSkills("");
    setHelperWhen(""); setRadius(""); setZip(""); setCity("");
    setPrice(""); setPreisart(""); setDesc("");
    setTimeout(() => setMsg(""), 3000);
  }

  return (
    <section className="bg-white min-h-screen px-5 md:px-10 py-12 max-w-5xl mx-auto w-full">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Erstellen Sie Ihre Anzeige</h2>

      {!loggedIn && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
          Bitte <button onClick={() => window.__helpAppRequireLogin?.("Bitte anmelden, um eine Anzeige aufzugeben.")} className="underline font-semibold cursor-pointer bg-transparent border-none p-0 text-amber-800">anmelden</button>, um eine Anzeige aufzugeben.
        </div>
      )}

      {msg && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-sm font-semibold">
          {msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-2xl">
        <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)}
          className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-700 transition-colors" />

        {loggedIn && (
          <div className="inline-flex items-center bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full w-fit">
            Rolle: {userRole === "helper" ? "Helfer" : "Auftraggeber"}
          </div>
        )}

        {(!loggedIn || userRole === "customer") && (
          <>
            <input type="text" placeholder="Wobei brauchst du Hilfe? (z.B. Umzug, Garten, Montage)" value={need} onChange={e => setNeed(e.target.value)}
              className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-700 transition-colors" />
            <div className="flex gap-3 flex-wrap">
              <input type="text" placeholder="Wann? (z.B. Samstag 14 Uhr)" value={when} onChange={e => setWhen(e.target.value)}
                className="flex-1 min-w-[160px] px-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-700 transition-colors" />
              <input type="text" placeholder="Budget (optional)" value={budget} onChange={e => setBudget(e.target.value)}
                className="flex-1 min-w-[160px] px-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-700 transition-colors" />
            </div>
          </>
        )}

        {loggedIn && userRole === "helper" && (
          <>
            <input type="text" placeholder="Deine Skills (z.B. Garten, Handwerk, Umzug)" value={skills} onChange={e => setSkills(e.target.value)}
              className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-700 transition-colors" />
            <div className="flex gap-3 flex-wrap">
              <input type="text" placeholder="Verfügbarkeit (z.B. Mo–Fr ab 17 Uhr)" value={helperWhen} onChange={e => setHelperWhen(e.target.value)}
                className="flex-1 min-w-[160px] px-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-700 transition-colors" />
              <input type="text" placeholder="Umkreis (optional, z.B. 15 km)" value={radius} onChange={e => setRadius(e.target.value)}
                className="flex-1 min-w-[160px] px-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-700 transition-colors" />
            </div>
          </>
        )}

        <div className="flex gap-3 flex-wrap">
          <input type="text" placeholder="PLZ" value={zip} onChange={e => setZip(e.target.value)}
            className="w-28 px-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-700 transition-colors" />
          <input type="text" placeholder="Ort" value={city} onChange={e => setCity(e.target.value)}
            className="flex-1 min-w-[140px] px-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-700 transition-colors" />
        </div>

        <div className="flex gap-3 flex-wrap items-center">
          <input type="text" placeholder="Preis" value={price} onChange={e => setPrice(e.target.value)}
            className="w-36 px-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-700 transition-colors" />
          <div className="flex flex-wrap gap-3 items-center text-sm text-gray-700">
            {["Festpreis", "Pauschal", "Pro Stunde", "Verhandelbar"].map(v => (
              <label key={v} className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" name="preisart" value={v} checked={preisart === v} onChange={() => setPreisart(v)} className="accent-gray-900" />
                {v}
              </label>
            ))}
          </div>
        </div>

        <textarea
          placeholder="Aufgaben Beschreibung"
          rows={5}
          value={desc}
          onChange={e => setDesc(e.target.value)}
          className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-700 transition-colors resize-y min-h-[140px]"
        />

        <button type="submit"
          className="px-6 py-3.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-700 transition-colors text-sm">
          Anzeige veröffentlichen
        </button>
      </form>

      {/* My Ads */}
      {loggedIn && (
        <>
          <hr className="my-10 border-gray-100" />
          <h3 className="font-bold text-gray-800 mb-3">Meine Anzeigen</h3>
          {myAds.length === 0 ? (
            <p className="text-gray-400 text-sm">Noch keine Anzeigen erstellt.</p>
          ) : (
            <div className="flex flex-col gap-3 max-w-2xl">
              {[...myAds].reverse().map(ad => (
                <Link key={ad.id} to={`/detail/${ad.id}`}
                  className="bg-gray-50 rounded-xl px-5 py-4 flex justify-between items-center gap-4 hover:shadow transition-shadow"
                  style={{ textDecoration: "none", color: "inherit" }}>
                  <div>
                    <div className="font-bold text-gray-900">{ad.title}</div>
                    <div className="text-sm text-gray-500 mt-0.5">{ad.city} · {new Date(ad.createdAt).toLocaleDateString("de-DE")}</div>
                  </div>
                  <span className="bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full shrink-0">{ad.priceLabel}</span>
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      <div className="mt-10 max-w-2xl">
        <PartnerBanner />
      </div>
    </section>
  );
}
