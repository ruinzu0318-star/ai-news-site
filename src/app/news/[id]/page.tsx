import { notFound } from "next/navigation";
import newsData from "../../../../data/news.json";

interface NewsItem {
  id: string;
  title: string;
  titleJa: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: string;
  tags: string[];
}

const news = newsData as NewsItem[];

export function generateStaticParams() {
  return news.map((item) => ({ id: item.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = news.find((n) => n.id === id);
  if (!item) return { title: "記事が見つかりません" };
  return {
    title: `${item.titleJa} | AI NEWS`,
    description: item.summary,
  };
}

const SOURCE_COLORS: Record<string, string> = {
  TechCrunch: "text-green-400 border-green-700",
  VentureBeat: "text-cyan-400 border-cyan-700",
  "MIT Technology Review": "text-purple-400 border-purple-700",
};

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = news.find((n) => n.id === id);
  if (!item) notFound();

  const publishedDate = new Date(item.publishedAt).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <a
        href="/"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-green-400 transition-colors mb-8"
      >
        ← ニュース一覧に戻る
      </a>

      <article>
        {/* Source + Date */}
        <div className="flex items-center gap-3 mb-4">
          <span
            className={`text-xs font-medium border rounded px-2 py-1 ${
              SOURCE_COLORS[item.source] || "text-gray-400 border-gray-700"
            }`}
          >
            {item.source}
          </span>
          <span className="text-sm text-gray-500">{publishedDate}</span>
        </div>

        {/* Japanese title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug mb-3">
          {item.titleJa}
        </h1>

        {/* Original title */}
        <p className="text-sm text-gray-500 mb-6 italic">{item.title}</p>

        {/* Summary */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-3">
            日本語要約
          </h2>
          <p className="text-gray-300 leading-relaxed text-base">{item.summary}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="text-sm bg-gray-800 text-gray-400 rounded-full px-3 py-1"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-cyan-500 text-black font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
        >
          原文を読む →
        </a>
      </article>
    </div>
  );
}
