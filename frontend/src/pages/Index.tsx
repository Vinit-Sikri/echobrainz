import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";

import {
  ArrowRight,
  BarChart,
  Brain,
  MusicIcon,
  Smile,
  Sparkles,
  Users,
} from "lucide-react";

const Index = () => {
  const { user } = useAuth();

  return (
    <Layout hideNavigation>
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column: Text Content */}
          <div className="space-y-6 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif leading-tight">
              Your Mood, <span className="text-primary">Understood.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto md:mx-0">
              Log your daily mood, get smart, AI-driven recommendations, and discover your emotional trends with your personal wellness partner.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              {user ? (
                <Button size="lg" asChild>
                  <Link to="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" asChild>
                    <Link to="/register">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/login">Login</Link>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Squircle Card (Wrapped for alignment) */}
          {/* FIX: Added a flex wrapper to align the card to the right on medium screens and up */}
          <div className="flex justify-center md:justify-end">
            <div className="
              group
              w-72 h-72 md:w-80 md:h-80 
              p-1.5
              bg-gradient-to-br from-primary via-secondary to-accent 
              rounded-[3rem] 
              shadow-lg 
              dark:shadow-primary/20
              hover:shadow-2xl 
              transition-all duration-300
              hover:-translate-y-2  
            ">
              <div className="
                w-full h-full 
                bg-background
                rounded-[2.6rem] 
                flex items-center justify-center
              ">
                <div className="text-center">
                  <div className="
                    text-5xl mb-4 
                    transform transition-transform duration-300 
                    group-hover:scale-110
                  ">
                    🧠
                  </div>
                  <h2 className="text-xl font-semibold mb-1 text-foreground">
                    Understand Yourself
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Map Your Inner World
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr />

      {/* Features Section */}
      <section className="py-16 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4">
              How EchoBrainzz Helps
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform uses AI to help you understand and improve your mental well-being through several key features.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Cards Here... */}
            <div className="bg-card p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Smile className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Voice & Text Check-ins</h3>
                <p className="text-muted-foreground">
                    Speak or write naturally, and our AI will analyze your emotional state.
                </p>
            </div>
            <div className="bg-card p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">
                    AI Recommendations
                </h3>
                <p className="text-muted-foreground">
                    Receive curated music, videos, and activities matched to your current mood.
                </p>
            </div>
            <div className="bg-card p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <BarChart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Mood Tracking</h3>
                <p className="text-muted-foreground">
                    Visualize your emotional patterns over time to identify triggers and track progress.
                </p>
            </div>
            {/* Add more feature cards as needed */}
          </div>
        </div>
      </section>

      <hr />

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-8 md:p-12 rounded-xl max-w-4xl mx-auto border">
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4">
              Begin Your Wellness Journey Today
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of users who are improving their well-being with EchoBrainzz. Your path to better mental health starts here.
            </p>
            {user ? (
              <Button size="lg" asChild>
                <Link to="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button size="lg" asChild>
                <Link to="/register">
                  Get Started for Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      <hr />

      {/* Footer */}
      <footer className="bg-muted/40 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Footer columns here... */}
          </div>
          <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} EchoBrainzz. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </Layout>
  );
};

export default Index;
