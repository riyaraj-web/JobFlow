import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Search, MapPin, ArrowRight, Sparkles, Users, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function HeroSection() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (location) params.set('location', location);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-dark py-20 md:py-32">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="animate-fade-in mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary-foreground/90">
            <Sparkles className="h-4 w-4" />
            <span>Over 10,000+ jobs available</span>
          </div>

          {/* Heading */}
          <h1 className="animate-slide-up font-serif text-4xl font-medium leading-tight text-primary-foreground md:text-6xl lg:text-7xl">
            Find Your Dream
            <span className="relative ml-4 inline-block">
              Career
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 8.5C50 2.5 150 2.5 198 8.5"
                  stroke="hsl(var(--accent))"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="animate-slide-up mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/70" style={{ animationDelay: '0.1s' }}>
            Connect with top companies and discover opportunities that match your skills, passion, and career goals.
          </p>

          {/* Search Form */}
          <form 
            onSubmit={handleSearch}
            className="animate-slide-up mx-auto mt-10 max-w-3xl"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="flex flex-col gap-3 rounded-2xl bg-background/10 p-3 backdrop-blur-lg md:flex-row md:items-center md:rounded-full md:p-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-foreground/50" />
                <Input
                  type="text"
                  placeholder="Job title or keyword"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 border-0 bg-transparent pl-12 text-primary-foreground placeholder:text-primary-foreground/50 focus-visible:ring-0"
                />
              </div>
              <div className="hidden h-8 w-px bg-primary-foreground/20 md:block" />
              <div className="relative flex-1">
                <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-foreground/50" />
                <Input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="h-12 border-0 bg-transparent pl-12 text-primary-foreground placeholder:text-primary-foreground/50 focus-visible:ring-0"
                />
              </div>
              <Button type="submit" variant="hero" size="lg" className="h-12 rounded-full px-8">
                Search Jobs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Stats */}
          <div 
            className="animate-slide-up mt-16 grid grid-cols-3 gap-8 md:gap-16"
            style={{ animationDelay: '0.3s' }}
          >
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-3xl font-bold text-primary-foreground md:text-4xl">
                <Building className="h-6 w-6 text-accent" />
                500+
              </div>
              <p className="mt-1 text-sm text-primary-foreground/60">Companies Hiring</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-3xl font-bold text-primary-foreground md:text-4xl">
                <Users className="h-6 w-6 text-accent" />
                50k+
              </div>
              <p className="mt-1 text-sm text-primary-foreground/60">Job Seekers</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-3xl font-bold text-primary-foreground md:text-4xl">
                <Sparkles className="h-6 w-6 text-accent" />
                95%
              </div>
              <p className="mt-1 text-sm text-primary-foreground/60">Success Rate</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
