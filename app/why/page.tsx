import Link from "next/link"
import { Languages, TrendingUp, Globe, Zap, Shield, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export const metadata = {
  title: "Why Nyuchi Lingo - Our Purpose & Vision",
  description:
    "Discover why Nyuchi Lingo is the best platform for learning English, Shona, Ndebele, and Chinese for practical, everyday communication.",
}

export default function WhyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
              <Languages className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Nyuchi Lingo</h1>
              <p className="text-xs text-muted-foreground">Nyuchi Learning</p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Why Nyuchi Lingo?</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            The bridge between cultures, powered by language learning that actually works.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">The Problem We Solve</h2>
          <Card className="mb-6">
            <CardContent className="p-6">
              <p className="text-muted-foreground leading-relaxed mb-4">
                In an increasingly connected Africa, the ability to communicate across languages is no longer
                optional—it's essential. Whether you're doing business with Chinese partners, traveling across Southern
                Africa, or simply trying to connect with people from different linguistic backgrounds, language barriers
                create real obstacles.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Traditional language learning apps focus on European languages or use generic approaches that don't
                address the specific needs of African learners. They teach formal grammar but ignore the colloquial
                phrases people actually use in daily life.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Our Solution</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Practical & Real</h3>
                <p className="text-muted-foreground">
                  Learn phrases you'll actually use in conversations, not outdated textbook examples. Every phrase is
                  relevant to modern life.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Culturally Authentic</h3>
                <p className="text-muted-foreground">
                  Context matters. We explain when and how to use each phrase, ensuring you communicate appropriately in
                  different situations.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4">
                  <Languages className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Multi-Language Comparison</h3>
                <p className="text-muted-foreground">
                  See all four languages side-by-side with pronunciation guides. This helps you understand patterns and
                  learn faster.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Track Your Progress</h3>
                <p className="text-muted-foreground">
                  Monitor your learning journey with detailed analytics, bookmarks, and progress tracking across all
                  your devices.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Why These Languages?</h2>
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2 text-blue-600 dark:text-blue-400">English</h3>
                <p className="text-muted-foreground">
                  The global language of business, technology, and international communication. Essential for anyone
                  looking to participate in the global economy.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2 text-green-600 dark:text-green-400">Shona</h3>
                <p className="text-muted-foreground">
                  Spoken by over 10 million people in Zimbabwe and surrounding regions. A key language for business and
                  cultural exchange in Southern Africa.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2 text-orange-600 dark:text-orange-400">Ndebele</h3>
                <p className="text-muted-foreground">
                  An important language in Zimbabwe and parts of South Africa. Understanding Ndebele opens doors to rich
                  cultural traditions and communities.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2 text-red-600 dark:text-red-400">Chinese (Mandarin)</h3>
                <p className="text-muted-foreground">
                  With China's growing economic presence in Africa, Chinese language skills are increasingly valuable
                  for business, trade, and diplomatic relations.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Who Benefits?</h2>
          <div className="grid gap-4">
            <Card>
              <CardContent className="p-6 flex items-start gap-4">
                <Users className="w-8 h-8 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Business Professionals</h3>
                  <p className="text-muted-foreground">
                    Communicate with clients, partners, and colleagues across language barriers. Build stronger
                    relationships through language.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-start gap-4">
                <TrendingUp className="w-8 h-8 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Students & Academics</h3>
                  <p className="text-muted-foreground">
                    Expand your linguistic capabilities and cultural understanding. Perfect for research, collaboration,
                    and personal growth.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-start gap-4">
                <Globe className="w-8 h-8 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Travelers & Expats</h3>
                  <p className="text-muted-foreground">
                    Navigate new places with confidence. Connect with locals and immerse yourself in different cultures
                    through language.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-start gap-4">
                <Shield className="w-8 h-8 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Language Enthusiasts</h3>
                  <p className="text-muted-foreground">
                    Satisfy your curiosity and expand your mind. Learning multiple languages simultaneously is
                    intellectually rewarding.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="text-center bg-muted/50 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Start Your Journey Today</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join our community of learners and discover how language learning can open new doors in your personal and
            professional life.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild size="lg">
              <Link href="/">Start Learning Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/about">Learn About Us</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t mt-20 py-8 bg-muted/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Nyuchi Learning. A Nyuchi Learning Initiative.</p>
          <div className="flex gap-4 justify-center mt-4">
            <Link href="/about" className="hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="/why" className="hover:text-foreground transition-colors">
              Why Nyuchi Lingo
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
