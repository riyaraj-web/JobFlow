import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Loader2, 
  Plus, 
  Building2, 
  Briefcase, 
  Users, 
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Clock,
  FileText,
  CheckCircle2,
  XCircle,
  MessageSquare
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Company, Job, Application, ApplicationStatus } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

const statusConfig: Record<ApplicationStatus, { label: string; icon: any; color: string }> = {
  pending: { label: 'Pending', icon: Clock, color: 'bg-muted text-muted-foreground' },
  reviewing: { label: 'Reviewing', icon: FileText, color: 'bg-primary/10 text-primary' },
  interviewed: { label: 'Interviewed', icon: MessageSquare, color: 'bg-accent/10 text-accent' },
  offered: { label: 'Offered', icon: CheckCircle2, color: 'bg-success/10 text-success' },
  rejected: { label: 'Rejected', icon: XCircle, color: 'bg-destructive/10 text-destructive' },
};

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialogs
  const [companyDialogOpen, setCompanyDialogOpen] = useState(false);
  const [jobDialogOpen, setJobDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form states
  const [companyForm, setCompanyForm] = useState({
    name: '',
    description: '',
    location: '',
    industry: '',
    size: '',
    website: '',
  });

  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    location: '',
    job_type: 'full-time' as const,
    salary_min: '',
    salary_max: '',
    requirements: '',
    benefits: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    if (!authLoading && profile && !profile.is_employer) {
      navigate('/dashboard');
      return;
    }

    const fetchData = async () => {
      if (!user) return;

      // Fetch company
      const { data: companyData } = await supabase
        .from('companies')
        .select('*')
        .eq('owner_id', user.id)
        .maybeSingle();

      if (companyData) {
        setCompany(companyData as Company);
        setCompanyForm({
          name: companyData.name,
          description: companyData.description || '',
          location: companyData.location || '',
          industry: companyData.industry || '',
          size: companyData.size || '',
          website: companyData.website || '',
        });

        // Fetch jobs for the company
        const { data: jobsData } = await supabase
          .from('jobs')
          .select('*')
          .eq('company_id', companyData.id)
          .order('created_at', { ascending: false });

        if (jobsData) {
          setJobs(jobsData as Job[]);

          // Fetch applications for all jobs
          const jobIds = jobsData.map(j => j.id);
          if (jobIds.length > 0) {
            const { data: appsData } = await supabase
              .from('applications')
              .select(`
                *,
                job:jobs(*),
                applicant:profiles(*)
              `)
              .in('job_id', jobIds)
              .order('created_at', { ascending: false });

            if (appsData) {
              setApplications(appsData as any[]);
            }
          }
        }
      }

      setLoading(false);
    };

    if (user && profile?.is_employer) {
      fetchData();
    }
  }, [user, profile, authLoading, navigate]);

  const handleSaveCompany = async () => {
    if (!user) return;
    setSaving(true);

    if (company) {
      // Update existing company
      const { error } = await supabase
        .from('companies')
        .update({
          name: companyForm.name,
          description: companyForm.description || null,
          location: companyForm.location || null,
          industry: companyForm.industry || null,
          size: companyForm.size || null,
          website: companyForm.website || null,
        })
        .eq('id', company.id);

      if (error) {
        toast({ title: 'Error', description: 'Failed to update company', variant: 'destructive' });
      } else {
        setCompany({ ...company, ...companyForm });
        toast({ title: 'Company updated' });
        setCompanyDialogOpen(false);
      }
    } else {
      // Create new company
      const { data, error } = await supabase
        .from('companies')
        .insert({
          owner_id: user.id,
          name: companyForm.name,
          description: companyForm.description || null,
          location: companyForm.location || null,
          industry: companyForm.industry || null,
          size: companyForm.size || null,
          website: companyForm.website || null,
        })
        .select()
        .single();

      if (error) {
        toast({ title: 'Error', description: 'Failed to create company', variant: 'destructive' });
      } else {
        setCompany(data as Company);
        toast({ title: 'Company created!' });
        setCompanyDialogOpen(false);
      }
    }

    setSaving(false);
  };

  const handleSaveJob = async () => {
    if (!company) return;
    setSaving(true);

    const { data, error } = await supabase
      .from('jobs')
      .insert({
        company_id: company.id,
        title: jobForm.title,
        description: jobForm.description,
        location: jobForm.location,
        job_type: jobForm.job_type,
        salary_min: jobForm.salary_min ? parseInt(jobForm.salary_min) : null,
        salary_max: jobForm.salary_max ? parseInt(jobForm.salary_max) : null,
        requirements: jobForm.requirements ? jobForm.requirements.split('\n').filter(r => r.trim()) : null,
        benefits: jobForm.benefits ? jobForm.benefits.split('\n').filter(b => b.trim()) : null,
      })
      .select()
      .single();

    if (error) {
      toast({ title: 'Error', description: 'Failed to post job', variant: 'destructive' });
    } else {
      setJobs([data as Job, ...jobs]);
      toast({ title: 'Job posted!' });
      setJobDialogOpen(false);
      setJobForm({
        title: '',
        description: '',
        location: '',
        job_type: 'full-time',
        salary_min: '',
        salary_max: '',
        requirements: '',
        benefits: '',
      });
    }

    setSaving(false);
  };

  const updateApplicationStatus = async (applicationId: string, status: ApplicationStatus) => {
    const { error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', applicationId);

    if (error) {
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
    } else {
      setApplications(applications.map(app => 
        app.id === applicationId ? { ...app, status } : app
      ));
      toast({ title: 'Status updated' });
    }
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-serif text-3xl font-medium">Employer Dashboard</h1>
            <p className="mt-1 text-muted-foreground">
              Manage your company, job listings, and applications
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setCompanyDialogOpen(true)}>
              <Building2 className="mr-2 h-4 w-4" />
              {company ? 'Edit Company' : 'Add Company'}
            </Button>
            {company && (
              <Button variant="hero" onClick={() => setJobDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Post Job
              </Button>
            )}
          </div>
        </div>

        {!company ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-20 text-center">
            <Building2 className="h-16 w-16 text-muted-foreground/50" />
            <h3 className="mt-4 font-serif text-xl font-medium">Set up your company</h3>
            <p className="mt-2 text-muted-foreground">
              Create your company profile to start posting jobs
            </p>
            <Button variant="hero" className="mt-6" onClick={() => setCompanyDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Company
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="jobs" className="space-y-6">
            <TabsList>
              <TabsTrigger value="jobs" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Jobs ({jobs.length})
              </TabsTrigger>
              <TabsTrigger value="applications" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Applications ({applications.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="jobs" className="space-y-4">
              {jobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-16 text-center">
                  <Briefcase className="h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 font-medium">No jobs posted yet</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Post your first job to start receiving applications
                  </p>
                  <Button variant="hero" className="mt-4" onClick={() => setJobDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Post Job
                  </Button>
                </div>
              ) : (
                jobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between rounded-xl border border-border bg-card p-6"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium">{job.title}</h3>
                        <Badge variant="outline" className={job.is_active ? 'bg-success/10 text-success' : 'bg-muted'}>
                          {job.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{job.location}</span>
                        <span>{job.job_type}</span>
                        <span>Posted {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}</span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/jobs/${job.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="applications" className="space-y-4">
              {applications.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-16 text-center">
                  <Users className="h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 font-medium">No applications yet</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Applications will appear here when candidates apply to your jobs
                  </p>
                </div>
              ) : (
                applications.map((application: any) => {
                  const status = statusConfig[application.status as ApplicationStatus];
                  const StatusIcon = status.icon;

                  return (
                    <div
                      key={application.id}
                      className="rounded-xl border border-border bg-card p-6"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="font-medium">{application.applicant?.full_name || 'Unknown'}</h3>
                          <p className="text-sm text-muted-foreground">{application.applicant?.email}</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Applied to <span className="font-medium">{application.job?.title}</span>
                            {' · '}
                            {formatDistanceToNow(new Date(application.created_at), { addSuffix: true })}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Select
                            value={application.status}
                            onValueChange={(value) => updateApplicationStatus(application.id, value as ApplicationStatus)}
                          >
                            <SelectTrigger className="w-40">
                              <Badge variant="outline" className={`${status.color} flex items-center gap-1.5`}>
                                <StatusIcon className="h-3.5 w-3.5" />
                                {status.label}
                              </Badge>
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(statusConfig).map(([key, config]) => (
                                <SelectItem key={key} value={key}>
                                  <div className="flex items-center gap-2">
                                    <config.icon className="h-4 w-4" />
                                    {config.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      {application.cover_letter && (
                        <div className="mt-4 rounded-lg bg-secondary/50 p-4">
                          <p className="text-sm font-medium text-muted-foreground">Cover Letter</p>
                          <p className="mt-2 text-sm">{application.cover_letter}</p>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </TabsContent>
          </Tabs>
        )}

        {/* Company Dialog */}
        <Dialog open={companyDialogOpen} onOpenChange={setCompanyDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{company ? 'Edit Company' : 'Add Company'}</DialogTitle>
              <DialogDescription>
                {company ? 'Update your company information' : 'Set up your company profile to start posting jobs'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  value={companyForm.name}
                  onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                  placeholder="Acme Inc"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyDescription">Description</Label>
                <Textarea
                  id="companyDescription"
                  value={companyForm.description}
                  onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })}
                  placeholder="Tell candidates about your company..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyLocation">Location</Label>
                  <Input
                    id="companyLocation"
                    value={companyForm.location}
                    onChange={(e) => setCompanyForm({ ...companyForm, location: e.target.value })}
                    placeholder="San Francisco, CA"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyIndustry">Industry</Label>
                  <Input
                    id="companyIndustry"
                    value={companyForm.industry}
                    onChange={(e) => setCompanyForm({ ...companyForm, industry: e.target.value })}
                    placeholder="Technology"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companySize">Company Size</Label>
                  <Input
                    id="companySize"
                    value={companyForm.size}
                    onChange={(e) => setCompanyForm({ ...companyForm, size: e.target.value })}
                    placeholder="50-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyWebsite">Website</Label>
                  <Input
                    id="companyWebsite"
                    value={companyForm.website}
                    onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })}
                    placeholder="https://acme.com"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCompanyDialogOpen(false)}>Cancel</Button>
              <Button variant="hero" onClick={handleSaveCompany} disabled={saving || !companyForm.name}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {company ? 'Save Changes' : 'Create Company'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Job Dialog */}
        <Dialog open={jobDialogOpen} onOpenChange={setJobDialogOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Post a Job</DialogTitle>
              <DialogDescription>
                Create a new job listing to attract qualified candidates
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title *</Label>
                <Input
                  id="jobTitle"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  placeholder="Senior Software Engineer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobDescription">Description *</Label>
                <Textarea
                  id="jobDescription"
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  placeholder="Describe the role, responsibilities, and what you're looking for..."
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jobLocation">Location *</Label>
                  <Input
                    id="jobLocation"
                    value={jobForm.location}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    placeholder="Remote / San Francisco"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Job Type</Label>
                  <Select
                    value={jobForm.job_type}
                    onValueChange={(value: any) => setJobForm({ ...jobForm, job_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salaryMin">Salary Min ($)</Label>
                  <Input
                    id="salaryMin"
                    type="number"
                    value={jobForm.salary_min}
                    onChange={(e) => setJobForm({ ...jobForm, salary_min: e.target.value })}
                    placeholder="80000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salaryMax">Salary Max ($)</Label>
                  <Input
                    id="salaryMax"
                    type="number"
                    value={jobForm.salary_max}
                    onChange={(e) => setJobForm({ ...jobForm, salary_max: e.target.value })}
                    placeholder="120000"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements (one per line)</Label>
                <Textarea
                  id="requirements"
                  value={jobForm.requirements}
                  onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                  placeholder="5+ years of experience&#10;Proficiency in React&#10;Strong communication skills"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="benefits">Benefits (one per line)</Label>
                <Textarea
                  id="benefits"
                  value={jobForm.benefits}
                  onChange={(e) => setJobForm({ ...jobForm, benefits: e.target.value })}
                  placeholder="Competitive salary&#10;Health insurance&#10;Remote work options"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setJobDialogOpen(false)}>Cancel</Button>
              <Button 
                variant="hero" 
                onClick={handleSaveJob} 
                disabled={saving || !jobForm.title || !jobForm.description || !jobForm.location}
              >
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Post Job
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default EmployerDashboard;
