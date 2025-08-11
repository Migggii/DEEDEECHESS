import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import Link from "next/link";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import textBlocks from "@/data/textBlocks.json";

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

      <div className="mb-8 p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-bold mb-2">{textBlocks.newsPage.title}</h2>
        <p className="text-gray-700">{textBlocks.newsPage.content}</p>
      </div>

      <Carousel
        responsive={{
          superLargeDesktop: {
            breakpoint: { max: 4000, min: 1024 },
            items: 5,
          },
          desktop: {
            breakpoint: { max: 1024, min: 768 },
            items: 3,
          },
          tablet: {
            breakpoint: { max: 768, min: 464 },
            items: 2,
          },
          mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
          },
        }}
        infinite
        autoPlay
        autoPlaySpeed={3000}
        keyBoardControl
        customTransition="all .5"
        transitionDuration={500}
        containerClass="carousel-container"
        itemClass="carousel-item-padding-40-px"
      >
        {news.map((item) => (
          <Link href={`/news/${item.id}`} key={item.id} legacyBehavior>
            <a className="block bg-zinc-900 hover:bg-zinc-800 rounded-lg overflow-hidden shadow-md">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  className="object-cover w-full h-48 rounded-md news-image"
                />
              )}
              <div className="p-4">
                <time className="text-xs text-gray-400 block">
                  {new Date(item.date).toLocaleDateString()}
                </time>
                <h2 className="text-md font-semibold mt-1 text-white leading-tight">
                  {item.title}
                </h2>
              </div>
            </a>
          </Link>
        ))}
      </Carousel>

      <style jsx>{`
        .news-image {
          width: 300px;
          height: 200px;
          object-fit: cover;
        }
      `}</style>
    </Layout>
  );
}
