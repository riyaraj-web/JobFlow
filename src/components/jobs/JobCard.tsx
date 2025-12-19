import { Link } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Building2, Bookmark } from 'lucide-react';
import { Job } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface JobCardProps {
  job: Job;
  onSave?: () => void;
  isSaved?: boolean;
}

const jobTypeColors: Record<string, string> = {
  'full-time': 'bg-success/10 text-success border-success/20',
  'part-time': 'bg-primary/10 text-primary border-primary/20',
  'contract': 'bg-accent/10 text-accent border-accent/20',
  'internship': 'bg-muted text-muted-foreground border-border',
  'remote': 'bg-primary/10 text-primary border-primary/20',
};

export function JobCard({ job, onSave, isSaved }: JobCardProps) {
  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return null;
    if (min && max) return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`;
    if (min) return `From $${(min / 1000).toFixed(0)}k`;
    if (max) return `Up to $${(max / 1000).toFixed(0)}k`;
    return null;
  };

  const salary = formatSalary(job.salary_min, job.salary_max);

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:-translate-y-1">
      {/* Save Button */}
      {onSave && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={(e) => {
            e.preventDefault();
            onSave();
          }}
        >
          <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-primary text-primary' : ''}`} />
        </Button>
      )}

      <Link to={`/jobs/${job.id}`} className="block">
        {/* Header */}
        <div className="flex items-start gap-4">
          {/* Company Logo */}
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-secondary to-muted">
            {job.company?.logo_url ? (
              <img 
                src={job.company.logo_url} 
                alt={job.company.name} 
                className="h-full w-full rounded-xl object-cover"
              />
            ) : (
              <Building2 className="h-7 w-7 text-muted-foreground" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-serif text-lg font-medium text-foreground transition-colors group-hover:text-primary">
              {job.title}
            </h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {job.company?.name || 'Company'}
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            {job.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
          </span>
          {salary && (
            <span className="flex items-center gap-1.5">
              <DollarSign className="h-4 w-4" />
              {salary}
            </span>
          )}
        </div>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="outline" className={jobTypeColors[job.job_type]}>
            {job.job_type.charAt(0).toUpperCase() + job.job_type.slice(1).replace('-', ' ')}
          </Badge>
          {job.company?.industry && (
            <Badge variant="outline" className="bg-secondary/50">
              {job.company.industry}
            </Badge>
          )}
        </div>

        {/* Description Preview */}
        <p className="mt-4 line-clamp-2 text-sm text-muted-foreground">
          {job.description}
        </p>
      </Link>
    </div>
  );
}
