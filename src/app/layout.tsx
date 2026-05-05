import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI 何でもNEWS - 海外の最新AI情報を日本語でお届け!",
  description:
    "TechCrunch、VentureBeat、MIT Technology ReviewのAI関連ニュースを日本語で毎朝お届けします。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.className} bg-gray-950 text-gray-100 min-h-screen`}>
        <nav className="border-b border-gray-800 bg-gray-950/90 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <a href="/" className="flex items-center gap-3">
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
                  AI NEWS
                </span>
              </a>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <a href="/" className="hover:text-green-400 transition-colors">
                  ホーム
                </a>
              </div>
            </div>
          </div>
        </nav>

        <main className="min-h-[calc(100vh-4rem)]">{children}</main>

        <footer className="border-t border-gray-800 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
              <p>
                © 2025 AI NEWS — TechCrunch / VentureBeat / MIT Technology
                Review より自動収集
              </p>
              <p>
                最終更新:{" "}
                {new Date().toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
