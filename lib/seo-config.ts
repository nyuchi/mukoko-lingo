import type { Metadata } from "next"

// Base URL configuration
export const siteConfig = {
  name: "Nyuchi Lingo",
  url: "https://nyuchilingo.com",
  description:
    "Learn essential travel phrases in English, Shona, Ndebele & Chinese. Perfect for tourists visiting Zimbabwe and Southern Africa. Master local languages with AI-powered learning.",
  keywords: [
    // Travel & Tourism focused
    "Zimbabwe travel phrases",
    "Southern Africa language guide",
    "tourist phrases Zimbabwe",
    "travel to Zimbabwe",
    "Victoria Falls language",
    "Zimbabwe tourism",
    "African travel languages",
    "tourist survival phrases",
    "Zimbabwe vacation phrases",
    "travel Africa language app",
    // Language learning
    "Shona language for tourists",
    "Ndebele travel phrases",
    "Chinese travel phrases",
    "English to Shona",
    "learn Shona online",
    "learn Ndebele online",
    "African language learning",
    "multilingual travel app",
    "language comparison tool",
    "phrase translator",
    // Location specific
    "Harare phrases",
    "Bulawayo language",
    "Zimbabwe local language",
    "Southern African languages",
    "Bantu languages",
    // Features
    "AI language tutor",
    "travel phrase book",
    "offline phrase guide",
    "language exchange",
    "pronunciation guide",
  ],
  author: "Nyuchi Tech",
  locale: "en_US",
  alternateLocales: ["sn_ZW", "nd_ZW", "zh_CN"],
}

// Structured data for organization
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Nyuchi Tech",
  url: siteConfig.url,
  logo: `${siteConfig.url}/favicon.png`,
  description: siteConfig.description,
  sameAs: [
    // Add social media links when available
  ],
}

// Structured data for web application
export const webApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: siteConfig.name,
  url: siteConfig.url,
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web Browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description: siteConfig.description,
  inLanguage: ["en", "sn", "nd", "zh"],
  featureList: [
    "200+ travel phrases in 4 languages",
    "AI-powered conversation practice",
    "Smart phrase recommendations",
    "Offline access to phrases",
    "Progress tracking",
    "Cultural context explanations",
    "Pronunciation guides",
  ],
}

// Default metadata factory
export function createMetadata(overrides?: Partial<Metadata>): Metadata {
  return {
    title: {
      default: `${siteConfig.name} - Travel Phrases for Zimbabwe & Southern Africa`,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: siteConfig.keywords,
    authors: [{ name: siteConfig.author, url: siteConfig.url }],
    creator: siteConfig.author,
    publisher: siteConfig.author,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: "/",
      languages: {
        en: "/",
        sn: "/",
        nd: "/",
        zh: "/",
      },
    },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      alternateLocale: siteConfig.alternateLocales,
      url: siteConfig.url,
      title: `${siteConfig.name} - Essential Travel Phrases for Zimbabwe`,
      description:
        "Master essential travel phrases in Shona, Ndebele, English & Chinese. Perfect for tourists exploring Zimbabwe, Victoria Falls, and Southern Africa.",
      siteName: siteConfig.name,
      images: [
        {
          url: "/favicon.png",
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} - Travel Language Learning`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteConfig.name} - Travel Phrases for Zimbabwe`,
      description:
        "Learn Shona, Ndebele & Chinese phrases for your Zimbabwe adventure. 200+ essential travel phrases with AI tutoring.",
      images: ["/favicon.png"],
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
    verification: {
      // Add verification codes when available
      google: "",
      bing: "",
    },
    ...overrides,
  }
}

// Structured data for educational content
export function createCourseSchema(category: string, phrasesCount: number) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `${category} Travel Phrases`,
    description: `Learn essential ${category} phrases for traveling in Zimbabwe and Southern Africa`,
    provider: {
      "@type": "Organization",
      name: "Nyuchi Tech",
      url: siteConfig.url,
    },
    educationalLevel: "Beginner to Intermediate",
    inLanguage: ["en", "sn", "nd", "zh"],
    numberOfLessons: phrasesCount,
    coursePrerequisites: "None - suitable for all travelers",
  }
}
