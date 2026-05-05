"use client";

import { useState, useMemo } from "react";
import newsData from "../../data/news.json";

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

const SOURCE_COLORS: Record<string, string> = {
  TechCrunch: "text-green-400 border-green-800",
  VentureBeat: "text-cyan-400 border-cyan-800",
  "MIT Technology Review": "text-purple-400 border-purple-800",
};

// 企業タブの定義：英語タイトル・タグに含まれるキーワードでマッチング
const COMPANY_TABS = [
  { label: "すべて", key: "all", keywords: [] },
  {
    label: "OpenAI・ChatGPT",
    key: "openai",
    keywords: ["openai", "chatgpt", "gpt-", "sora", "o1", "o3"],
  },
  {
    label: "Google・Gemini",
    key: "google",
    keywords: ["google", "gemini", "deepmind", "bard", "waymo"],
  },
  {
    label: "Anthropic・Claude",
    key: "anthropic",
    keywords: ["anthropic", "claude"],
  },
  {
    label: "Meta・Llama",
    key: "meta",
    keywords: ["meta ", " meta", "llama", "facebook"],
  },
  {
    label: "Microsoft・Copilot",
    key: "microsoft",
    keywords: ["microsoft", "copilot", "azure", "bing"],
  },
  {
    label: "xAI・Grok",
    key: "xai",
    keywords: ["xai", " grok", "elon musk"],
  },
] as const;

type CompanyKey = (typeof COMPANY_TABS)[number]["key"];

function matchesCompany(item: NewsItem, key: CompanyKey): boolean {
  if (key === "all") return true;
  const tab = COMPANY_TABS.find((t) => t.key === key)!;
  const haystack =
    (item.title + " " + item.tags.join(" ")).toLowerCase();
  return tab.keywords.some((kw) => haystack.includes(kw));
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function Home() {
  const [activeCompany, setActiveCompany] = useState<CompanyKey>("all");

  const filtered = useMemo(() => {
    return news
      .filter((item) => matchesCompany(item, activeCompany))
      .slice(0, 12);
  }, [activeCompany]);

  // 表示中の記事に含まれるトピックタグ（企業名タグは除外）
  const companyTagNames = new Set(
    COMPANY_TABS.flatMap((t) =>
      t.key !== "all"
        ? [
            "OpenAI", "Google", "Anthropic", "Meta", "Microsoft",
            "xAI", "DeepMind", "ChatGPT", "Gemini", "Claude", "Llama",
            "Copilot", "Waymo", "Facebook",
          ]
        : []
    )
  );

  const topicTags = useMemo(() => {
    const tagCount: Record<string, number> = {};
    news.forEach((item) => {
      item.tags.forEach((tag) => {
        if (!companyTagNames.has(tag)) {
          tagCount[tag] = (tagCount[tag] || 0) + 1;
        }
      });
    });
    return Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag)
      .slice(0, 12);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-3">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500">
            最新AIニュース
          </span>
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">
          海外主要メディアのAI関連ニュースを毎朝6時に日本語要約してお届け
        </p>
      </div>

      {/* 企業タブ */}
      <div className="flex flex-wrap gap-2 mb-4">
        {COMPANY_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveCompany(tab.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
              activeCompany === tab.key
                ? "bg-green-500 border-green-500 text-black"
                : "border-gray-700 text-gray-400 hover:border-green-600 hover:text-green-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* トピックタグ（小さめ） */}
      {topicTags.length > 0 && activeCompany === "all" && (
        <div className="flex flex-wrap gap-1.5 mb-8">
          {topicTags.map((tag) => (
            <span
              key={tag}
              className="text-xs border border-gray-800 text-gray-500 rounded-full px-2.5 py-0.5"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      {activeCompany !== "all" && <div className="mb-8" />}

      {/* ニュースグリッド */}
      {filtered.length === 0 ? (
        <div className="text-center py-24 text-gray-500">
          <p className="text-5xl mb-4">📭</p>
          <p className="text-lg">該当する記事がありません</p>
          <p className="text-sm mt-2">別のタブを選択するか、翌朝の更新をお待ちください</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, i) => (
            <a
              key={item.id}
              href={`/news/${item.id}`}
              className="group block bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-green-700 hover:shadow-lg hover:shadow-green-950 transition-all duration-300 hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {/* Source + Date */}
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-xs font-medium border rounded px-2 py-0.5 ${
                    SOURCE_COLORS[item.source] || "text-gray-400 border-gray-700"
                  }`}
                >
                  {item.source}
                </span>
                <span className="text-xs text-gray-500">
                  {formatDate(item.publishedAt)}
                </span>
              </div>

              {/* Title */}
              <h2 className="font-semibold text-gray-100 mb-2 leading-snug group-hover:text-green-400 transition-colors line-clamp-2">
                {item.titleJa}
              </h2>

              {/* Summary */}
              <p className="text-sm text-gray-400 leading-relaxed line-clamp-3 mb-4">
                {item.summary}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {item.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-gray-800 text-gray-400 rounded-full px-2 py-0.5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
