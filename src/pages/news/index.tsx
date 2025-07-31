import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import Link from "next/link";

type NewsItem = {
  id: string;
  date: string;
  title: string;
  content: string;
  image?: string;
  link?: string;
};

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/news")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: NewsItem[]) => {
        const sorted = data.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setNews(sorted);
      })
      .catch((err) => setError(err.message));
  }, []);

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">News</h1>

      {error && (
        <p className="text-red-500 mb-6">
          Fehler beim Laden der News: {error}
        </p>
      )}

      {news.length === 0 && !error && (
        <p className="text-gray-400">Noch keine News vorhanden.</p>
      )}

      <div className="grid gap-8 max-w-4xl mx-auto">
        {news.map((item) => (
          <article
            key={item.id}
            className="bg-zinc-900 p-6 rounded-xl shadow-md border border-zinc-700 transition hover:shadow-lg"
          >
            <time className="text-sm text-gray-400">
              {new Date(item.date).toLocaleDateString()}
            </time>

            <h2 className="text-2xl font-semibold mt-2 text-white">
              {item.title}
            </h2>

            {item.image && (
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-64 object-cover rounded-lg mt-4"
              />
            )}

            <p className="mt-4 text-gray-300 whitespace-pre-line leading-relaxed">
              {item.content.length > 300
                ? `${item.content.slice(0, 300)}...`
                : item.content}
            </p>

            <Link
              href={`/news/${item.id}`}
              className="inline-block mt-4 text-blue-400 hover:underline"
            >
              Mehr erfahren →
            </Link>
          </article>
        ))}
      </div>
    </Layout>
  );
}
