import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/lib/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Reservvo",
  description: "Plataforma de agendamento e reservas",
};

const themeScript = `
(function(){
  try {
    var raw = localStorage.getItem("reservvo-ui");
    if (raw) {
      var parsed = JSON.parse(raw);
      var theme = parsed && parsed.state && parsed.state.theme;
      if (theme === "dark") {
        var d = document.documentElement.style;
        d.setProperty("--background","#0a0a0a");
        d.setProperty("--foreground","#ededed");
        d.setProperty("--border","rgba(255, 255, 255, 0.10)");
        d.setProperty("--border-strong","rgba(255, 255, 255, 0.22)");
        d.setProperty("--muted","rgba(255, 255, 255, 0.04)");
        d.setProperty("--card","#0a0a0a");
      }
    }
  } catch(e){}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
