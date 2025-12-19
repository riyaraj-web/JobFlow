import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2, Frown } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { JobFilters } from '@/components/jobs/JobFilters';
import { JobCard } from '@/components/jobs/JobCard';
import { supabase } from '@/integrations/supabase/client';
import { Job, JobType } from '@/lib/types';

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [locationQuery, setLocationQuery] = useState(searchParams.get('location') || '');
  const [jobType, setJobType] = useState<JobType | 'all'>(
    (searchParams.get('type') as JobType | 'all') || 'all'
  );

  const fetchJobs = async () => {
    setLoading(true);
    
    let query = supabase
      .from('jobs')
      .select(`
        *,
        company:companies(*)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
    }

    if (locationQuery) {
      query = query.ilike('location', `%${locationQuery}%`);
    }

    if (jobType !== 'all') {
      query = query.eq('job_type', jobType);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching jobs:', error);
    } else {
      setJobs(data as Job[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (locationQuery) params.set('location', locationQuery);
    if (jobType !== 'all') params.set('type', jobType);
    setSearchParams(params);
    fetchJobs();
  };

  return (
    <Layout>
      {/* Header */}
      <section className="border-b border-border bg-card py-10">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-3xl font-medium md:text-4xl">Find Jobs</h1>
          <p className="mt-2 text-muted-foreground">
            Discover opportunities that match your skills and interests
          </p>
          
          {/* Filters */}
          <div className="mt-8">
            <JobFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              locationQuery={locationQuery}
              onLocationChange={setLocationQuery}
              jobType={jobType}
              onJobTypeChange={setJobType}
              onSearch={handleSearch}
            />
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : jobs.length > 0 ? (
            <>
              <p className="mb-6 text-sm text-muted-foreground">
                {jobs.length} job{jobs.length !== 1 ? 's' : ''} found
              </p>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {jobs.map((job, index) => (
                  <div
                    key={job.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <JobCard job={job} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Frown className="h-16 w-16 text-muted-foreground/50" />
              <h3 className="mt-4 font-serif text-xl font-medium">No jobs found</h3>
              <p className="mt-2 text-muted-foreground">
                Try adjusting your search filters or check back later
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Jobs;
