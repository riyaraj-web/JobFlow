import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, FileText, Clock, CheckCircle2, XCircle, MessageSquare, Building2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Application, ApplicationStatus } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

const statusConfig: Record<ApplicationStatus, { label: string; icon: any; color: string }> = {
  pending: { label: 'Pending', icon: Clock, color: 'bg-muted text-muted-foreground' },
  reviewing: { label: 'Reviewing', icon: FileText, color: 'bg-primary/10 text-primary' },
  interviewed: { label: 'Interviewed', icon: MessageSquare, color: 'bg-accent/10 text-accent' },
  offered: { label: 'Offered', icon: CheckCircle2, color: 'bg-success/10 text-success' },
  rejected: { label: 'Rejected', icon: XCircle, color: 'bg-destructive/10 text-destructive' },
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    const fetchApplications = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          job:jobs(
            *,
            company:companies(*)
          )
        `)
        .eq('applicant_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching applications:', error);
      } else {
        setApplications(data as Application[]);
      }
      setLoading(false);
    };

    if (user) {
      fetchApplications();
    }
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (profile?.is_employer) {
    navigate('/employer/dashboard');
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-serif text-3xl font-medium">My Applications</h1>
            <p className="mt-1 text-muted-foreground">
              Track the status of your job applications
            </p>
          </div>
          <Button variant="hero" asChild>
            <Link to="/jobs">Find More Jobs</Link>
          </Button>
        </div>

        {applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-20 text-center">
            <FileText className="h-16 w-16 text-muted-foreground/50" />
            <h3 className="mt-4 font-serif text-xl font-medium">No applications yet</h3>
            <p className="mt-2 text-muted-foreground">
              Start applying to jobs to see your applications here
            </p>
            <Button variant="hero" className="mt-6" asChild>
              <Link to="/jobs">Browse Jobs</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application, index) => {
              const status = statusConfig[application.status];
              const StatusIcon = status.icon;

              return (
                <div
                  key={application.id}
                  className="animate-slide-up rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-secondary to-muted">
                        {application.job?.company?.logo_url ? (
                          <img 
                            src={application.job.company.logo_url} 
                            alt={application.job.company.name} 
                            className="h-full w-full rounded-xl object-cover"
                          />
                        ) : (
                          <Building2 className="h-7 w-7 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <Link 
                          to={`/jobs/${application.job_id}`}
                          className="font-medium hover:text-primary"
                        >
                          {application.job?.title}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {application.job?.company?.name}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Applied {formatDistanceToNow(new Date(application.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className={`${status.color} flex items-center gap-1.5`}>
                      <StatusIcon className="h-3.5 w-3.5" />
                      {status.label}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
