import Anthropic from "@anthropic-ai/sdk";
import Parser from "rss-parser";
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

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

const RSS_FEEDS = [
  {
    url: "https://techcrunch.com/category/artificial-intelligence/feed/",
    source: "TechCrunch",
  },
  {
    url: "https://venturebeat.com/category/ai/feed/",
    source: "VentureBeat",
  },
  {
    url: "https://www.technologyreview.com/feed/",
    source: "MIT Technology Review",
  },
];

const MAX_ARTICLES = 30;
const DATA_FILE = path.join(process.cwd(), "data", "news.json");

const client = new Anthropic();
const parser = new Parser();

function hashUrl(url: string): string {
  return crypto.createHash("sha256").update(url).digest("hex").slice(0, 16);
}

function loadExistingNews(): NewsItem[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (e) {
    console.error("Failed to load existing news:", e);
  }
  return [];
}

async function summarizeArticle(
  title: string,
  content: string,
  source: string
): Promise<{ titleJa: string; summary: string; tags: string[] }> {
  const prompt = `以下の英語記事を日本語で要約してください。

タイトル: ${title}
ソース: ${source}
内容: ${content.slice(0, 2000)}

以下のJSON形式で回答してください（他のテキストは不要）:
{
  "titleJa": "記事タイトルの日本語訳（簡潔に）",
  "summary": "日本語要約（200字以内）",
  "tags": ["関連タグ1", "関連タグ2"]（トピック: AI, LLM, 画像生成, ロボット, 自動運転, セキュリティ, ビジネス, 研究 などから選択。企業名: 記事に登場する場合は OpenAI, Google, Anthropic, Meta, Microsoft, xAI, Apple, Amazon, Nvidia なども追加）
}`;

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 500,
    messages: [{ role: "user", content: prompt }],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("No JSON found in response");
  }

  return JSON.parse(jsonMatch[0]);
}

async function fetchFeed(
  feedUrl: string,
  source: string
): Promise<Array<{ title: string; url: string; content: string; pubDate: string }>> {
  try {
    const feed = await parser.parseURL(feedUrl);
    return (feed.items || []).map((item) => ({
      title: item.title || "",
      url: item.link || "",
      content: item.contentSnippet || item.content || item.summary || "",
      pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
    }));
  } catch (e) {
    console.error(`Failed to fetch feed from ${source}:`, e);
    return [];
  }
}

async function main() {
  console.log("Fetching AI news...");

  const existingNews = loadExistingNews();
  const existingIds = new Set(existingNews.map((n) => n.id));

  const allArticles: Array<{
    title: string;
    url: string;
    content: string;
    pubDate: string;
    source: string;
  }> = [];

  for (const feed of RSS_FEEDS) {
    console.log(`Fetching from ${feed.source}...`);
    const articles = await fetchFeed(feed.url, feed.source);
    allArticles.push(...articles.map((a) => ({ ...a, source: feed.source })));
  }

  const newArticles = allArticles.filter((a) => {
    if (!a.url) return false;
    const id = hashUrl(a.url);
    return !existingIds.has(id);
  });

  const toProcess = newArticles.slice(0, MAX_ARTICLES);
  console.log(`Processing ${toProcess.length} new articles...`);

  const newNewsItems: NewsItem[] = [];

  for (const article of toProcess) {
    try {
      console.log(`Summarizing: ${article.title}`);
      const { titleJa, summary, tags } = await summarizeArticle(
        article.title,
        article.content,
        article.source
      );

      newNewsItems.push({
        id: hashUrl(article.url),
        title: article.title,
        titleJa,
        summary,
        url: article.url,
        source: article.source,
        publishedAt: new Date(article.pubDate).toISOString(),
        tags,
      });

      await new Promise((r) => setTimeout(r, 500));
    } catch (e) {
      console.error(`Failed to process article "${article.title}":`, e);
    }
  }

  const merged = [...newNewsItems, ...existingNews].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(merged, null, 2), "utf-8");

  console.log(
    `Done. Added ${newNewsItems.length} new articles. Total: ${merged.length}`
  );
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
