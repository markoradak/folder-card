import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./theme-provider";
import { Nav } from "./nav";

export const metadata: Metadata = {
  title: "@markoradak/folder-card",
  description:
    "Animated folder-style card with FLIP spring expansion, 3D lid rotation, and render props API",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var dark = theme === 'dark' || (!theme || theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (dark) document.documentElement.classList.add('dark');
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider>
          <Nav />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
