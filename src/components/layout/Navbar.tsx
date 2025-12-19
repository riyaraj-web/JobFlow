import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Briefcase, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Navbar() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-hero">
              <Briefcase className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-serif text-xl font-medium">JobFlow</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            <Link 
              to="/jobs" 
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Find Jobs
            </Link>
            {user && profile?.is_employer && (
              <Link 
                to="/employer/dashboard" 
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Employer Dashboard
              </Link>
            )}
            {user && !profile?.is_employer && (
              <Link 
                to="/dashboard" 
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                My Applications
              </Link>
            )}
          </div>

          {/* Auth Buttons / User Menu */}
          <div className="hidden items-center gap-4 md:flex">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || ''} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(profile?.full_name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{profile?.full_name || 'User'}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/auth')}>
                  Sign In
                </Button>
                <Button variant="hero" onClick={() => navigate('/auth?mode=signup')}>
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="animate-slide-up border-t border-border pb-4 pt-2 md:hidden">
            <div className="flex flex-col gap-2">
              <Link 
                to="/jobs" 
                className="rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Find Jobs
              </Link>
              {user && profile?.is_employer && (
                <Link 
                  to="/employer/dashboard" 
                  className="rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Employer Dashboard
                </Link>
              )}
              {user && !profile?.is_employer && (
                <Link 
                  to="/dashboard" 
                  className="rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Applications
                </Link>
              )}
              <div className="mt-2 border-t border-border pt-2">
                {user ? (
                  <>
                    <Link 
                      to="/profile" 
                      className="rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary flex items-center gap-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                    <button 
                      onClick={() => { handleSignOut(); setMobileMenuOpen(false); }}
                      className="w-full rounded-lg px-4 py-2 text-left text-sm font-medium text-destructive transition-colors hover:bg-secondary flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2 px-4">
                    <Button variant="outline" onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }}>
                      Sign In
                    </Button>
                    <Button variant="hero" onClick={() => { navigate('/auth?mode=signup'); setMobileMenuOpen(false); }}>
                      Get Started
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
