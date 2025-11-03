import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  TrendingUp, 
  Shield, 
  Users, 
  BarChart3, 
  Zap, 
  BookOpen,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import heroImage from "@assets/generated_images/Crypto_blockchain_network_hero_3ffbea32.png";
import Navbar from "@/components/Navbar";

export default function Landing() {
  const features = [
    {
      icon: TrendingUp,
      title: "Real-Time Trading",
      description: "Trade Bitcoin and Ethereum with live prices updated every 30 seconds from CoinGecko API"
    },
    {
      icon: Shield,
      title: "Sandbox Mode",
      description: "Practice risk-free with $10,000 virtual balance before trading with real funds"
    },
    {
      icon: Users,
      title: "Copy Trading",
      description: "Learn from top traders and replicate their successful strategies"
    },
    {
      icon: BarChart3,
      title: "Portfolio Analytics",
      description: "Beautiful charts showing allocation, performance, and historical value"
    },
    {
      icon: Zap,
      title: "Instant Execution",
      description: "Automatic order matching with FIFO algorithm for fair and fast trades"
    },
    {
      icon: BookOpen,
      title: "Educational Focus",
      description: "Built for beginners with clear interfaces and comprehensive transaction history"
    }
  ];

  const steps = [
    { title: "Create Account", description: "Sign up with email and secure password" },
    { title: "Start in Sandbox", description: "Practice trading with virtual funds" },
    { title: "Learn & Grow", description: "Follow top traders and analyze your performance" }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section 
        className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-chart-2 to-chart-3">
            Start Trading Crypto with Confidence
          </h1>
          <p className="text-xl md:text-2xl text-foreground/90 mb-8 max-w-3xl mx-auto">
            Educational cryptocurrency exchange platform designed for beginners. 
            Practice, learn, and master crypto trading risk-free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8 backdrop-blur-sm" data-testid="button-hero-start">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-8 backdrop-blur-sm bg-background/50" data-testid="button-hero-login">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features for Learning</h2>
            <p className="text-xl text-muted-foreground">Everything you need to become a confident crypto trader</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover-elevate" data-testid={`card-feature-${index}`}>
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">Get started in three simple steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center" data-testid={`step-${index}`}>
                <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {index + 1}
                </div>
                <h3 className="text-2xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Safe & Secure Trading Environment</h2>
              <div className="space-y-4">
                {[
                  "JWT authentication with bcrypt password hashing",
                  "Secure session management with auto-expiry",
                  "Real-time price data from trusted APIs",
                  "Balance validation to prevent overselling",
                  "Complete transaction history for transparency"
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-chart-2 flex-shrink-0 mt-0.5" />
                    <p className="text-lg">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <Card className="p-8">
              <h3 className="text-2xl font-semibold mb-4">Ready to Start?</h3>
              <p className="text-muted-foreground mb-6">
                Join thousands of learners mastering cryptocurrency trading with our educational platform.
              </p>
              <Link href="/register">
                <Button size="lg" className="w-full" data-testid="button-cta-signup">
                  Create Free Account
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      <footer className="border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground">
            © 2025 CryptoLearn. Educational platform for cryptocurrency trading.
          </p>
        </div>
      </footer>
    </div>
  );
}
