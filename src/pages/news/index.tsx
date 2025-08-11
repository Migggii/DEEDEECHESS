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
      <h1 className="text-3xl font-bold mb-8 text-center">Aktuelle News</h1>

      {error && (
        <p className="text-red-500 mb-6 text-center">
          Fehler beim Laden der News: {error}
        </p>
      )}

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {news.map((item) => {
          console.log("Image path:", item.image);
          return (
            <Link href={`/news/${item.id}`} key={item.id} legacyBehavior>
              <a className="block bg-zinc-900 hover:bg-zinc-800 rounded-lg overflow-hidden shadow-md transition-transform hover:-translate-y-1">
                {item.image && (
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="object-cover w-full h-full max-w-full max-h-64 rounded-md"
                    />
                  </div>
                )}

                <div className="p-4">
                  <time className="text-xs text-gray-400 block">
                    {new Date(item.date).toLocaleDateString()}
                  </time>
                  <h2 className="text-md font-semibold mt-1 text-white leading-tight">
                    {item.title}
                  </h2>
                  <p className="text-gray-400 mt-1 text-sm line-clamp-3">
                    {item.content.length > 80
                      ? `${item.content.slice(0, 80)}...`
                      : item.content}
                  </p>
                  <span className="text-blue-400 hover:underline mt-2 inline-block text-sm">
                    Mehr erfahren →
                  </span>
                </div>
              </a>
            </Link>
          );
        })}
      </div>
    </Layout>
  );
}
