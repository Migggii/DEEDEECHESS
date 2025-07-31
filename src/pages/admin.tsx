import Layout from "@/components/Layout";
import { useEffect, useState } from "react";

type Tournament = {
  day: number;
  month: number;
  year: number;
  title: string;
  link: string;
  image: string;
};

export default function AdminPage() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  const correctPassword = "chess2025"; // 🔒 Passwort anpassen für Produktion

  // 🧠 Login aus localStorage prüfen
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsAuthed(localStorage.getItem("adminAuthed") === "true");
    }
  }, []);

  // 📥 Turniere von Server laden
  useEffect(() => {
    if (isAuthed) {
      fetch("/api/tournaments")
        .then((res) => res.json())
        .then((data) => setTournaments(data))
        .catch((err) => console.error("Fehler beim Laden der Turniere:", err));
    }
  }, [isAuthed]);

  // 💾 Turniere speichern
  const saveTournaments = async (updated: Tournament[]) => {
    try {
      await fetch("/api/tournaments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
    } catch (err) {
      console.error("Fehler beim Speichern:", err);
    }
  };

  const handleLogin = () => {
    if (passwordInput === correctPassword) {
      setIsAuthed(true);
      localStorage.setItem("adminAuthed", "true");
    } else {
      alert("Wrong password!");
    }
  };

  const handleLogout = () => {
    setIsAuthed(false);
    localStorage.removeItem("adminAuthed");
  };

  const addTournament = () => {
    const newTournament: Tournament = {
      day: 1,
      month: 0,
      year: 2025,
      title: "",
      link: "",
      image: "",
    };
    const updated = [...tournaments, newTournament];
    setTournaments(updated);
    saveTournaments(updated);
  };

  const updateTournament = (index: number, field: keyof Tournament, value: string) => {
    const updated = [...tournaments];
    if (field === "day" || field === "month" || field === "year") {
      updated[index][field] = parseInt(value);
    } else {
      updated[index][field] = value;
    }
    setTournaments(updated);
    saveTournaments(updated);
  };

  const deleteTournament = (index: number) => {
    const updated = tournaments.filter((_, i) => i !== index);
    setTournaments(updated);
    saveTournaments(updated);
  };

  if (!isAuthed) {
    return (
      <Layout>
        <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
        <input
          type="password"
          placeholder="Enter password"
          className="p-2 rounded bg-zinc-700 text-white"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="ml-2 bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded"
        >
          Login
        </button>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
        <h2 className="text-2xl font-bold">Admin: Manage Tournaments</h2>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-800 text-white px-4 py-2 rounded w-fit self-start"
        >
          Logout
        </button>
      </div>

      <button
        onClick={addTournament}
        className="mb-4 bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded"
      >
        Add Tournament
      </button>

      <div className="space-y-4">
        {tournaments.map((t, index) => (
          <div key={index} className="flex items-center gap-2 flex-wrap">
            <input
              type="number"
              min={1}
              max={31}
              value={t.day}
              onChange={(e) => updateTournament(index, "day", e.target.value)}
              className="p-2 w-16 text-white bg-zinc-700 rounded"
              placeholder="Day"
            />
            <input
            type="number"
            min={1}
            max={12}
            value={t.month + 1}
            onChange={(e) => updateTournament(index, "month", String(Number(e.target.value) - 1))}
            className="p-2 w-16 text-white bg-zinc-700 rounded"
            placeholder="Month"
            />
            <input
              type="number"
              min={2024}
              max={2099}
              value={t.year}
              onChange={(e) => updateTournament(index, "year", e.target.value)}
              className="p-2 w-20 text-white bg-zinc-700 rounded"
              placeholder="Year"
            />
            <input
              type="text"
              value={t.title}
              onChange={(e) => updateTournament(index, "title", e.target.value)}
              className="p-2 w-40 text-white bg-zinc-700 rounded"
              placeholder="Title"
            />
            <input
              type="text"
              value={t.link}
              onChange={(e) => updateTournament(index, "link", e.target.value)}
              className="p-2 w-40 text-white bg-zinc-700 rounded"
              placeholder="Link"
            />
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const formData = new FormData();
                formData.append("file", file);

                try {
                  const res = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                  });
                  const data = await res.json();
                  updateTournament(index, "image", data.path);
                } catch {
                  alert("Upload failed");
                }
              }}
              className="file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 text-white"
            />
            <button
              onClick={() => deleteTournament(index)}
              className="bg-red-600 hover:bg-red-800 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </Layout>
  );
}
