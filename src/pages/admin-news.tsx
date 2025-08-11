import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

type NewsItem = {
  id: string;
  date: string;
  title: string;
  content: string;
  image?: string;
  link?: string;
};

export default function NewsAdmin() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [news, setNews] = useState<NewsItem[]>([]);

  const correctPassword = "chess2025";

  useEffect(() => {
    setIsAuthed(localStorage.getItem("adminAuthed") === "true");
  }, []);

  useEffect(() => {
    if (isAuthed) {
      fetch("/api/news")
        .then(async (res) => {
          if (!res.ok) {
            const text = await res.text();
            console.error("Fehlerhafte Antwort vom Server:", text);
            throw new Error(`Antwortstatus: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => setNews(data))
        .catch((err) =>
          console.error("Fehler beim Laden der News (Catch):", err)
        );
    }
  }, [isAuthed]);

  const saveNews = async (updated: NewsItem[]) => {
    try {
      await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
    } catch (err) {
      console.error("Fehler beim Speichern:", err);
    }
  };

  const addNewsItem = () => {
    const newItem: NewsItem = {
      id: uuidv4(),
      date: new Date().toISOString().split("T")[0],
      title: "",
      content: "",
    };
    const updated = [...news, newItem];
    setNews(updated);
    saveNews(updated);
  };

  const updateNews = (index: number, field: keyof NewsItem, value: string) => {
    const updated = [...news];
    updated[index][field] = value;
    setNews(updated);
    saveNews(updated);
  };

  const deleteNews = (index: number) => {
    const updated = news.filter((_, i) => i !== index);
    setNews(updated);
    saveNews(updated);
  };

  if (!isAuthed) {
    return (
      <Layout>
        <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
        <input
          type="password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          className="p-2 rounded bg-zinc-700 text-white"
          placeholder="Password"
        />
        <button
          onClick={() => {
            if (passwordInput === correctPassword) {
              setIsAuthed(true);
              localStorage.setItem("adminAuthed", "true");
            } else {
              alert("Falsches Passwort!");
            }
          }}
          className="ml-2 bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded"
        >
          Login
        </button>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Admin: Manage News</h2>
        <button
          onClick={addNewsItem}
          className="bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded"
        >
          Add News
        </button>
      </div>

      <div className="space-y-4">
        {news.map((n, index) => (
          <div key={n.id} className="bg-zinc-800 p-4 rounded shadow space-y-2">
            <input
              type="date"
              value={n.date}
              onChange={(e) => updateNews(index, "date", e.target.value)}
              className="w-full p-2 bg-zinc-700 text-white rounded"
            />
            <input
              type="text"
              value={n.title}
              onChange={(e) => updateNews(index, "title", e.target.value)}
              placeholder="Titel"
              className="w-full p-2 bg-zinc-700 text-white rounded"
            />
            <textarea
              value={n.content}
              onChange={(e) => updateNews(index, "content", e.target.value)}
              placeholder="Inhalt"
              className="w-full p-2 bg-zinc-700 text-white rounded"
            />
            <input
              type="text"
              value={n.link || ""}
              onChange={(e) => updateNews(index, "link", e.target.value)}
              placeholder="Optionaler Link"
              className="w-full p-2 bg-zinc-700 text-white rounded"
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

                  // Direkt den Bildpfad speichern
                  updateNews(index, "image", data.path);
                } catch {
                  alert("Bild-Upload fehlgeschlagen");
                }
              }}
              className="text-white"
            />
            <button
              onClick={() => deleteNews(index)}
              className="bg-red-600 hover:bg-red-800 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={() => saveNews(news)}
        className="bg-green-600 hover:bg-green-800 text-white px-4 py-2 rounded mt-4"
      >
        Änderungen speichern
      </button>
    </Layout>
  );
}
