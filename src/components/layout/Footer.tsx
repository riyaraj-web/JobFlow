import { Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-hero">
                <Briefcase className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-serif text-xl font-medium">JobFlow</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Connecting talented professionals with opportunities that matter.
            </p>
          </div>

          {/* For Job Seekers */}
          <div>
            <h4 className="font-medium">For Job Seekers</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/jobs" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  My Applications
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h4 className="font-medium">For Employers</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/employer/dashboard" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link to="/employer/dashboard" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Manage Listings
                </Link>
              </li>
              <li>
                <Link to="/auth?mode=signup&employer=true" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Employer Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-medium">Support</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <span className="text-sm text-muted-foreground">help@jobflow.com</span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">Privacy Policy</span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">Terms of Service</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} JobFlow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
