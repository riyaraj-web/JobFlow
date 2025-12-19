import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Building2, 
  Briefcase,
  Globe,
  Users,
  CheckCircle2,
  Gift,
  Loader2,
  ArrowLeft,
  Share2,
  Bookmark
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Job } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const jobTypeColors: Record<string, string> = {
  'full-time': 'bg-success/10 text-success border-success/20',
  'part-time': 'bg-primary/10 text-primary border-primary/20',
  'contract': 'bg-accent/10 text-accent border-accent/20',
  'internship': 'bg-muted text-muted-foreground border-border',
  'remote': 'bg-primary/10 text-primary border-primary/20',
};

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          company:companies(*)
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching job:', error);
        toast({
          title: 'Error',
          description: 'Failed to load job details',
          variant: 'destructive',
        });
      } else {
        setJob(data as Job);
      }
      setLoading(false);
    };

    const checkApplication = async () => {
      if (!id || !user) return;

      const { data } = await supabase
        .from('applications')
        .select('id')
        .eq('job_id', id)
        .eq('applicant_id', user.id)
        .maybeSingle();

      setHasApplied(!!data);
    };

    fetchJob();
    if (user) {
      checkApplication();
    }
  }, [id, user]);

  const handleApply = async () => {
    if (!user || !job) {
      navigate('/auth');
      return;
    }

    setApplying(true);

    const { error } = await supabase.from('applications').insert({
      job_id: job.id,
      applicant_id: user.id,
      cover_letter: coverLetter || null,
    });

    if (error) {
      toast({
        title: 'Error',
        description: error.code === '23505' ? 'You have already applied to this job' : 'Failed to submit application',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Application submitted!',
        description: 'Your application has been sent to the employer',
      });
      setHasApplied(true);
      setApplyDialogOpen(false);
    }

    setApplying(false);
  };

  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return null;
    if (min && max) return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k / year`;
    if (min) return `From $${(min / 1000).toFixed(0)}k / year`;
    if (max) return `Up to $${(max / 1000).toFixed(0)}k / year`;
    return null;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!job) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <h2 className="font-serif text-2xl font-medium">Job not found</h2>
          <p className="mt-2 text-muted-foreground">This job listing may have been removed</p>
          <Button variant="outline" className="mt-6" onClick={() => navigate('/jobs')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Button>
        </div>
      </Layout>
    );
  }

  const salary = formatSalary(job.salary_min, job.salary_max);

  return (
    <Layout>
      {/* Header */}
      <section className="border-b border-border bg-card py-10">
        <div className="container mx-auto px-4">
          <Link 
            to="/jobs" 
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Link>

          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary to-muted">
                {job.company?.logo_url ? (
                  <img 
                    src={job.company.logo_url} 
                    alt={job.company.name} 
                    className="h-full w-full rounded-2xl object-cover"
                  />
                ) : (
                  <Building2 className="h-10 w-10 text-muted-foreground" />
                )}
              </div>
              <div>
                <h1 className="font-serif text-2xl font-medium md:text-3xl">{job.title}</h1>
                <p className="mt-1 text-lg text-muted-foreground">{job.company?.name}</p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <Badge variant="outline" className={jobTypeColors[job.job_type]}>
                    {job.job_type.charAt(0).toUpperCase() + job.job_type.slice(1).replace('-', ' ')}
                  </Badge>
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Bookmark className="h-4 w-4" />
              </Button>
              {profile?.is_employer ? null : hasApplied ? (
                <Button disabled variant="secondary" size="lg">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Applied
                </Button>
              ) : (
                <Button variant="hero" size="lg" onClick={() => setApplyDialogOpen(true)}>
                  Apply Now
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="rounded-xl border border-border bg-card p-6 md:p-8">
                <h2 className="font-serif text-xl font-medium">Job Description</h2>
                <p className="mt-4 whitespace-pre-wrap text-muted-foreground">{job.description}</p>

                {job.requirements && job.requirements.length > 0 && (
                  <>
                    <Separator className="my-8" />
                    <h2 className="font-serif text-xl font-medium">Requirements</h2>
                    <ul className="mt-4 space-y-3">
                      {job.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-success" />
                          <span className="text-muted-foreground">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {job.benefits && job.benefits.length > 0 && (
                  <>
                    <Separator className="my-8" />
                    <h2 className="font-serif text-xl font-medium">Benefits</h2>
                    <ul className="mt-4 space-y-3">
                      {job.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Gift className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
                          <span className="text-muted-foreground">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Salary Card */}
              {salary && (
                <div className="rounded-xl border border-border bg-card p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
                      <DollarSign className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Salary Range</p>
                      <p className="font-medium">{salary}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Company Card */}
              {job.company && (
                <div className="rounded-xl border border-border bg-card p-6">
                  <h3 className="font-serif text-lg font-medium">About the Company</h3>
                  <div className="mt-4 space-y-4">
                    {job.company.description && (
                      <p className="text-sm text-muted-foreground">{job.company.description}</p>
                    )}
                    <div className="space-y-3">
                      {job.company.industry && (
                        <div className="flex items-center gap-3 text-sm">
                          <Briefcase className="h-4 w-4 text-muted-foreground" />
                          <span>{job.company.industry}</span>
                        </div>
                      )}
                      {job.company.size && (
                        <div className="flex items-center gap-3 text-sm">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{job.company.size} employees</span>
                        </div>
                      )}
                      {job.company.location && (
                        <div className="flex items-center gap-3 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{job.company.location}</span>
                        </div>
                      )}
                      {job.company.website && (
                        <div className="flex items-center gap-3 text-sm">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <a 
                            href={job.company.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {job.company.website.replace(/^https?:\/\//, '')}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Apply Dialog */}
      <Dialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply for {job.title}</DialogTitle>
            <DialogDescription>
              Submit your application to {job.company?.name}. Make sure your profile is up to date.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cover-letter">Cover Letter (Optional)</Label>
              <Textarea
                id="cover-letter"
                placeholder="Tell the employer why you're a great fit for this role..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApplyDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="hero" onClick={handleApply} disabled={applying}>
              {applying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default JobDetail;
