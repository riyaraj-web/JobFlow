import { Search, MapPin, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { JobType } from '@/lib/types';

interface JobFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  locationQuery: string;
  onLocationChange: (value: string) => void;
  jobType: JobType | 'all';
  onJobTypeChange: (value: JobType | 'all') => void;
  onSearch: () => void;
}

export function JobFilters({
  searchQuery,
  onSearchChange,
  locationQuery,
  onLocationChange,
  jobType,
  onJobTypeChange,
  onSearch,
}: JobFiltersProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-3 md:flex-row">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Job title, keywords, or company"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-12 pl-12 pr-4 text-base"
          />
        </div>

        {/* Location Input */}
        <div className="relative flex-1 md:max-w-xs">
          <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="City or remote"
            value={locationQuery}
            onChange={(e) => onLocationChange(e.target.value)}
            className="h-12 pl-12 pr-4 text-base"
          />
        </div>

        {/* Job Type Select */}
        <Select value={jobType} onValueChange={(value) => onJobTypeChange(value as JobType | 'all')}>
          <SelectTrigger className="h-12 w-full md:w-40">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Job Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="full-time">Full-time</SelectItem>
            <SelectItem value="part-time">Part-time</SelectItem>
            <SelectItem value="contract">Contract</SelectItem>
            <SelectItem value="internship">Internship</SelectItem>
            <SelectItem value="remote">Remote</SelectItem>
          </SelectContent>
        </Select>

        {/* Search Button */}
        <Button type="submit" variant="hero" size="lg" className="h-12 px-8">
          Search Jobs
        </Button>
      </div>
    </form>
  );
}
