// app/layout.tsx - обнови существующий файл
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sports Competitions",
  description: "Sports competitions management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav className="bg-blue-600 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <a href="/" className="text-xl font-bold">Sports Competitions</a>
              <div className="flex space-x-4">
                <a href="/" className="hover:bg-blue-700 px-3 py-2 rounded">Dashboard</a>
                <a href="/athletes" className="hover:bg-blue-700 px-3 py-2 rounded">Athletes</a>
                <a href="/coaches" className="hover:bg-blue-700 px-3 py-2 rounded">Coaches</a>
                <a href="/competitions" className="hover:bg-blue-700 px-3 py-2 rounded">Competitions</a>
                <a href="/reports" className="hover:bg-blue-700 px-3 py-2 rounded">Reports</a>
                <a href="/help" className="hover:bg-blue-700 px-3 py-2 rounded">Help</a>
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}