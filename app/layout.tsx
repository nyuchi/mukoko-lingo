import type React from "react"
import type { Metadata } from "next"
import { Inter, Noto_Serif } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "600", "700"],
})

export const metadata: Metadata = {
  title: "Nyuchi Lingo - Learn English, Shona, Ndebele & Chinese | Nyuchi Learning",
  description:
    "Master colloquial phrases in English, Shona, Ndebele, and Chinese. Compare translations side-by-side and learn authentic everyday communication across African and Asian languages.",
  keywords: [
    "language learning",
    "Shona language",
    "Ndebele language",
    "Chinese language",
    "English phrases",
    "African languages",
    "colloquial phrases",
    "language comparison",
    "Nyuchi Learning",
    "multilingual education",
  ],
  authors: [{ name: "Nyuchi Learning" }],
  creator: "Nyuchi Learning",
  publisher: "Nyuchi Learning",
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["sn_ZW", "nd_ZW", "zh_CN"],
    url: "https://nyuchilingo.com",
    title: "Nyuchi Lingo - Multilingual Language Learning Platform",
    description:
      "Learn and compare colloquial phrases in English, Shona, Ndebele, and Chinese. Bridge communication gaps across cultures.",
    siteName: "Nyuchi Lingo",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nyuchi Lingo - Learn 4 Languages",
    description: "Master colloquial phrases in English, Shona, Ndebele & Chinese with side-by-side comparisons.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  generator: "v0.app",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${notoSerif.variable} font-sans antialiased`}>
        <div className="flag-strip" aria-hidden="true" />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
