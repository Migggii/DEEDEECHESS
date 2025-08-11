import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { useEffect, useState } from "react";

type NewsItem = {
  id: string;
  date: string;
  title: string;
  content: string;
  image?: string;
  link?: string;
};

export default function NewsDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    fetch("/api/news")
      .then((res) => res.json())
      .then((data: NewsItem[]) => {
        const found = data.find((item) => item.id === id);
        if (!found) {
          setError("Beitrag nicht gefunden.");
        } else {
          setNewsItem(found);
        }
      })
      .catch(() => setError("Fehler beim Laden."));
  }, [id]);

  return (
    <Layout>
      {!newsItem && !error && <p className="text-gray-400">Lade Beitrag...</p>}

      {error && <p className="text-red-500">{error}</p>}

      {newsItem && (
        <article className="max-w-3xl mx-auto bg-zinc-900 p-6 rounded-xl border border-zinc-700">
          <time className="text-sm text-gray-400">
            {new Date(newsItem.date).toLocaleDateString()}
          </time>

          <h1 className="text-3xl font-bold mt-2">{newsItem.title}</h1>

          {newsItem.image && (
            <img
              src={newsItem.image}
              alt={newsItem.title}
              className="w-full h-auto max-h-64 object-cover rounded-md mt-4"
            />
          )}

          <p className="mt-6 whitespace-pre-line text-gray-300 leading-relaxed">
            {newsItem.content}
          </p>

          {newsItem.link && (
            <a
              href={newsItem.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-6 text-blue-400 hover:underline"
            >
              Original-Link →
            </a>
          )}
        </article>
      )}
    </Layout>
  );
}
