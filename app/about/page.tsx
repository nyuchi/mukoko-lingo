import Link from "next/link"
import { Languages, Globe, Users, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export const metadata = {
  title: "About Us - Nyuchi Lingo",
  description:
    "Learn about Nyuchi Lingo's mission to bridge communication gaps across African and Asian languages through innovative language learning.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
              <Languages className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">Nyuchi Lingo</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">Nyuchi Learning</p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-6 py-8 sm:py-12 max-w-5xl">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-balance">About Nyuchi Lingo</h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto text-pretty px-2">
            Breaking down language barriers across Africa and Asia, one phrase at a time.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 mb-8 sm:mb-12">
          <Card>
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
              <p className="text-muted-foreground">
                To empower Africans to communicate effectively across English, Shona, Ndebele, and Chinese by providing
                accessible, practical language learning tools.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Who We Serve</h3>
              <p className="text-muted-foreground">
                Students, professionals, travelers, and anyone interested in learning colloquial phrases to communicate
                naturally across cultures.
              </p>
            </CardContent>
          </Card>
        </div>

        <section className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Our Story</h2>
          <div className="prose dark:prose-invert max-w-none text-sm sm:text-base">
            <p className="text-muted-foreground leading-relaxed mb-4">
              Nyuchi Lingo was founded as part of the Nyuchi Learning initiative to address the growing need for
              practical language education that bridges African and international languages. We recognized that while
              formal language education exists, there was a gap in teaching the colloquial, everyday phrases that people
              actually use in real conversations.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Our platform focuses on English, Shona, Ndebele, and Chinese because of their strategic importance in
              African business, education, and cultural exchange. By presenting these languages side-by-side, we make it
              easy for learners to understand context, pronunciation, and appropriate usage.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We believe that language learning should be accessible, practical, and culturally authentic. Every phrase
              in our collection has been carefully selected to reflect real-world usage and help learners communicate
              with confidence.
            </p>
          </div>
        </section>

        <section className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">What Makes Us Different</h2>
          <div className="grid gap-3 sm:gap-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  Colloquial Focus
                </h3>
                <p className="text-muted-foreground">
                  We teach how people actually speak, not just formal textbook language. Our phrases reflect authentic,
                  everyday communication.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Languages className="w-5 h-5 text-primary" />
                  Side-by-Side Comparison
                </h3>
                <p className="text-muted-foreground">
                  See all four languages at once with pronunciation guides and cultural context, making it easy to
                  understand similarities and differences.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Built for Africans
                </h3>
                <p className="text-muted-foreground">
                  Designed specifically for African learners with an understanding of the unique linguistic and cultural
                  context of the continent.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="text-center bg-muted/50 rounded-lg p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Ready to Start Learning?</h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 max-w-2xl mx-auto px-2">
            Join thousands of learners who are breaking down language barriers and building bridges across cultures.
          </p>
          <div className="flex gap-3 sm:gap-4 justify-center flex-wrap">
            <Button asChild size="lg">
              <Link href="/">Start Learning</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/why">Learn More</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t mt-12 sm:mt-20 py-6 sm:py-8 bg-muted/30">
        <div className="container mx-auto px-3 sm:px-6 text-center text-xs sm:text-sm text-muted-foreground">
          <p>© 2025 Nyuchi Learning. A Nyuchi Learning Initiative.</p>
          <div className="flex gap-4 sm:gap-4 justify-center mt-4">
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
