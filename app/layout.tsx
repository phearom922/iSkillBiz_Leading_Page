import type { Metadata } from "next";
import { Kantumruy_Pro } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ContentProvider } from "@/components/ContentProvider";

const kantumruyPro = Kantumruy_Pro({
  subsets: ["latin", "khmer"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-kantumruy-pro",
});

export const metadata: Metadata = {
  title: "iskillbiz – All-in-One Chatbot Broadcasting Platform",
  description: "Reach thousands of customers instantly through chat apps using automated chatbot broadcasting — without coding.",
  icons: {
    icon: "/images/iskillsbiz_icon.png",
    apple: "/images/iskillsbiz_icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="km" suppressHydrationWarning>
      <body className={`${kantumruyPro.variable} font-sans antialiased`}>
        <ThemeProvider>
          <ContentProvider>
            {children}
          </ContentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

