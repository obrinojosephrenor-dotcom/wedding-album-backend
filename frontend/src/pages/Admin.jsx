import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAdminStats, getGuestList, deleteAdminPhoto } from "../services/api";
import { usePhotos }   from "../hooks/usePhotos";
import PhotoCard       from "../components/PhotoCard";
import QRPreview       from "../components/QRPreview";
import FloralBorder    from "../components/FloralBorder";
import Masonry         from "react-masonry-css";
import toast           from "react-hot-toast";
import { Users, Image, HardDrive, Download, LogOut } from "lucide-react";

const ADMIN_KEY = "wedding_admin_token";

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="floral-card text-center">
      <Icon size={24} className={`mx-auto mb-2 ${color}`} />
      <p className="font-heading text-3xl text-gray-700">{value ?? "—"}</p>
      <p className="font-body text-sm text-taupe">{label}</p>
    </div>
  );
}

export default function Admin() {
  const [token,    setToken]    = useState(() => sessionStorage.getItem(ADMIN_KEY) || "");
  const [authed,   setAuthed]   = useState(false);
  const [input,    setInput]    = useState("");
  const [stats,    setStats]    = useState(null);
  const [guests,   setGuests]   = useState([]);
  const [tab,      setTab]      = useState("overview");
  const { photos, loading }     = usePhotos();

  async function login(e) {
    e.preventDefault();
    try {
      const data = await getAdminStats(input);
      sessionStorage.setItem(ADMIN_KEY, input);
      setToken(input);
      setStats(data);
      setAuthed(true);
    } catch {
      toast.error("Invalid admin password");
    }
  }

  useEffect(() => {
    if (!authed || !token) return;
    getAdminStats(token).then(setStats).catch(console.error);
    getGuestList(token).then(r => setGuests(r.guests)).catch(console.error);
  }, [authed, token]);

  async function handleDelete(photoId) {
    if (!confirm("Delete this photo?")) return;
    try {
      await deleteAdminPhoto(photoId, token);
      toast.success("Photo deleted");
    } catch {
      toast.error("Failed to delete");
    }
  }

  function logout() {
    sessionStorage.removeItem(ADMIN_KEY);
    setToken(""); setAuthed(false);
  }

  const downloadURL = `${import.meta.env.VITE_API_URL}/api/admin/download`;

  // Login screen
  if (!authed) return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="floral-card max-w-sm w-full text-center"
      >
        <FloralBorder />
        <span className="script-accent text-3xl block mb-2">Admin Access</span>
        <h1 className="section-title text-2xl mb-6">Wedding Dashboard</h1>
        <form onSubmit={login} className="space-y-4">
          <input
            type="password"
            className="input-field"
            placeholder="Admin password"
            value={input}
            onChange={e => setInput(e.target.value)}
            required
            autoFocus
            aria-label="Admin password"
          />
          <button type="submit" className="btn-primary w-full">Enter Dashboard</button>
        </form>
        <FloralBorder position="bottom" />
      </motion.div>
    </main>
  );

  const TABS = ["overview", "gallery", "guests", "qrcode"];

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <span className="script-accent text-3xl block">Admin</span>
            <h1 className="section-title text-2xl">Wedding Dashboard</h1>
          </div>
          <button onClick={logout} className="btn-secondary flex items-center gap-2 text-sm px-4 py-2" aria-label="Log out">
            <LogOut size={15} /> Log Out
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-full font-body text-sm font-medium capitalize transition-all
                ${tab === t ? "bg-blush text-white" : "bg-white/80 text-taupe hover:bg-blush/10"}`}
              aria-pressed={tab === t}
            >
              {t}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{    opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >

            {/* OVERVIEW TAB */}
            {tab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <StatCard label="Total Guests"  value={stats?.total_guests} icon={Users}     color="text-sage" />
                  <StatCard label="Total Photos"  value={stats?.total_photos} icon={Image}     color="text-blush" />
                  <StatCard label="Storage Used"  value={stats?.storage?.used_gb ? `${stats.storage.used_gb} GB` : "—"}
                            icon={HardDrive} color="text-dusty" />
                </div>
                <div className="floral-card text-center">
                  <FloralBorder />
                  <p className="font-body text-sm text-taupe mb-4">
                    Download all wedding photos as a ZIP archive
                  </p>
                  <a
                    href={downloadURL}
                    target="_blank"
                    rel="noreferrer"
                    onClick={e => {
                      e.preventDefault();
                      fetch(downloadURL, { headers: { Authorization: `Bearer ${token}` } })
                        .then(r => r.blob())
                        .then(blob => {
                          const a = document.createElement("a");
                          a.href = URL.createObjectURL(blob);
                          a.download = "wedding-album.zip";
                          a.click();
                        })
                        .catch(() => toast.error("Download failed"));
                    }}
                    className="btn-primary inline-flex items-center gap-2"
                    aria-label="Download all photos as ZIP"
                  >
                    <Download size={16} /> Download All Photos
                  </a>
                  <FloralBorder position="bottom" />
                </div>
              </div>
            )}

            {/* GALLERY TAB */}
            {tab === "gallery" && (
              <div>
                {loading ? (
                  <p className="text-center font-body text-taupe py-10">Loading photos…</p>
                ) : photos.length === 0 ? (
                  <p className="text-center font-body text-taupe py-10">No photos yet.</p>
                ) : (
                  <Masonry
                    breakpointCols={{ default: 4, 1024: 3, 768: 2, 480: 2 }}
                    className="flex gap-4 -ml-4"
                    columnClassName="pl-4 space-y-4"
                  >
                    {photos.map(p => (
                      <PhotoCard key={p.id} photo={p} isAdmin onDelete={handleDelete} />
                    ))}
                  </Masonry>
                )}
              </div>
            )}

            {/* GUESTS TAB */}
            {tab === "guests" && (
              <div className="floral-card overflow-x-auto">
                <FloralBorder />
                <table className="w-full font-body text-sm" aria-label="Guest list">
                  <thead>
                    <tr className="text-left border-b border-blush/20">
                      <th className="pb-2 pr-4 text-taupe font-medium">Name</th>
                      <th className="pb-2 pr-4 text-taupe font-medium">Photos</th>
                      <th className="pb-2 text-taupe font-medium">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {guests.map(g => (
                      <tr key={g.id} className="border-b border-silver/20 hover:bg-blush/5">
                        <td className="py-2 pr-4 text-gray-700">{g.guest_name}</td>
                        <td className="py-2 pr-4 text-gray-600">{g.photo_count} / 25</td>
                        <td className="py-2 text-taupe text-xs">
                          {new Date(g.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                    {guests.length === 0 && (
                      <tr>
                        <td colSpan={3} className="py-6 text-center text-taupe">No guests yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <FloralBorder position="bottom" />
              </div>
            )}

            {/* QR CODE TAB */}
            {tab === "qrcode" && (
              <QRPreview url={import.meta.env.VITE_API_URL?.replace(":4000", ":5173") || window.location.origin} />
            )}

          </motion.div>
        </AnimatePresence>

      </div>
    </main>
  );
}