import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-2">
          {/* For Job Seekers */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-hero p-8 md:p-10">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl transition-transform group-hover:scale-150" />
            <div className="relative">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-white/20">
                <Briefcase className="h-7 w-7 text-white" />
              </div>
              <h3 className="mt-6 font-serif text-2xl font-medium text-white md:text-3xl">
                Looking for a Job?
              </h3>
              <p className="mt-3 text-white/80">
                Create your profile, upload your resume, and start applying to thousands of jobs today. Your dream career is just a click away.
              </p>
              <Button 
                asChild
                variant="secondary" 
                size="lg" 
                className="mt-6 bg-white text-primary hover:bg-white/90"
              >
                <Link to="/auth?mode=signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* For Employers */}
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 md:p-10">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/5 blur-2xl transition-transform group-hover:scale-150" />
            <div className="relative">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <Users className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mt-6 font-serif text-2xl font-medium md:text-3xl">
                Hiring Top Talent?
              </h3>
              <p className="mt-3 text-muted-foreground">
                Post job openings, review applications, and connect with qualified candidates. Find the perfect match for your team.
              </p>
              <Button 
                asChild
                variant="hero" 
                size="lg" 
                className="mt-6"
              >
                <Link to="/auth?mode=signup&employer=true">
                  Post a Job
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
