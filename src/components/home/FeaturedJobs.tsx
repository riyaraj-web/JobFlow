import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Job } from '@/lib/types';
import { JobCard } from '@/components/jobs/JobCard';
import { Button } from '@/components/ui/button';

export function FeaturedJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          company:companies(*)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) {
        console.error('Error fetching jobs:', error);
      } else {
        setJobs(data as Job[]);
      }
      setLoading(false);
    };

    fetchJobs();
  }, []);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="font-serif text-3xl font-medium md:text-4xl">
              Featured Opportunities
            </h2>
            <p className="mt-2 text-muted-foreground">
              Discover the latest job openings from top companies
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/jobs" className="flex items-center gap-2">
              View All Jobs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="mt-12 flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : jobs.length > 0 ? (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job, index) => (
              <div
                key={job.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <JobCard job={job} />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-xl border border-dashed border-border bg-card p-12 text-center">
            <p className="text-muted-foreground">No jobs available yet. Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
}
