import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, Volume2, Users, Zap, Globe, Star, ArrowRight, Play, CheckCircle } from "lucide-react"
import { PRICING_PLANS, SUPPORTED_LANGUAGES } from "@/constants/pricing"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Mic className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">Audio AI Studio</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/pricing">
                <Button variant="ghost">Pricing</Button>
              </Link>
              <Link href="/signin">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-4" variant="secondary">
            🎉 Now in Beta - Try for Free
          </Badge>
          <h1 className="text-5xl font-bold tracking-tight mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
            Ultra-Realistic Text-to-Speech & Voice Cloning
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Create human-like speech, clone voices instantly, dub videos with perfect lip-sync, and build conversational AI experiences across 32+ languages.
          </p>
          <div className="flex items-center justify-center gap-4 mb-12">
            <Button size="lg" className="text-lg px-8">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          {/* Demo Audio Player */}
          <Card className="max-w-md mx-auto mb-12">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="text-sm font-medium">Sample Voice Generation</div>
                  <div className="text-xs text-muted-foreground">Alloy Voice • English</div>
                </div>
                <Button size="sm" variant="outline">
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything You Need for Professional Audio AI</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From individual creators to enterprise teams, our comprehensive platform scales with your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Mic className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Text-to-Speech</CardTitle>
                <CardDescription>
                  Ultra-realistic voices with adjustable prosody, speed, pitch, and SSML support across 32+ languages.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Voice Cloning</CardTitle>
                <CardDescription>
                  Instant short-sample cloning and professional multi-sample workflows for perfect voice replication.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Volume2 className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Dubbing Studio</CardTitle>
                <CardDescription>
                  Automated lip-sync dubbing, subtitle import, per-segment voice assignment, and embedded audio export.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Conversational AI</CardTitle>
                <CardDescription>
                  Voice-based chatbots with persistent context and webchat widgets for seamless customer experiences.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Globe className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Speech-to-Text</CardTitle>
                <CardDescription>
                  High-accuracy transcription with punctuation, speaker diarization, and downloadable transcripts.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Star className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Studio Interface</CardTitle>
                <CardDescription>
                  Multi-track editor, timeline, batch processing, version history, and professional export options.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Languages Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">32+ Languages Supported</h2>
            <p className="text-lg text-muted-foreground">
              Reach global audiences with native-sounding voices in every major language.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {SUPPORTED_LANGUAGES.slice(0, 20).map((lang) => (
              <Badge key={lang.code} variant="outline" className="text-sm">
                {lang.nativeName}
              </Badge>
            ))}
            <Badge variant="outline" className="text-sm">
              +12 more
            </Badge>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Start free and scale as you grow. No hidden fees, no surprises.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {PRICING_PLANS.slice(0, 4).map((plan) => (
              <Card key={plan.tier} className={plan.popular ? "border-primary shadow-lg" : ""}>
                <CardHeader>
                  {plan.popular && (
                    <Badge className="w-fit mb-2">Most Popular</Badge>
                  )}
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold">
                    ${plan.price}
                    <span className="text-base font-normal text-muted-foreground">/month</span>
                  </div>
                  <CardDescription>
                    {plan.credits.toLocaleString()} credits included
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {plan.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-4" variant={plan.popular ? "default" : "outline"}>
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/pricing">
              <Button variant="outline" size="lg">
                View All Plans
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Audio Content?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of creators, businesses, and enterprises using Audio AI Studio to create amazing audio experiences.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" className="text-lg px-8">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Mic className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">Audio AI Studio</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
              <Link href="/support">Support</Link>
              <Link href="/api-docs">API Docs</Link>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-muted-foreground">
            © 2024 Audio AI Studio. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
