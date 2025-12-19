import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Briefcase, FileText, Loader2, Save } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  headline: z.string().max(200).optional(),
  bio: z.string().max(1000).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const Profile = () => {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name || '',
      headline: profile?.headline || '',
      bio: profile?.bio || '',
    },
  });

  if (authLoading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleSubmit = async (data: ProfileFormData) => {
    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: data.full_name,
        headline: data.headline || null,
        bio: data.bio || null,
      })
      .eq('id', user.id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    } else {
      await refreshProfile();
      toast({
        title: 'Profile updated',
        description: 'Your changes have been saved',
      });
    }

    setSaving(false);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-serif text-3xl font-medium">Your Profile</h1>
          <p className="mt-2 text-muted-foreground">
            Update your personal information and make your profile stand out
          </p>

          <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-8 space-y-6">
            <div className="rounded-xl border border-border bg-card p-6">
              {/* Email (Read-only) */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={user.email || ''}
                    disabled
                    className="h-12 pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Your email cannot be changed</p>
              </div>

              {/* Full Name */}
              <div className="mt-6 space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="full_name"
                    type="text"
                    placeholder="John Doe"
                    className="h-12 pl-10"
                    {...form.register('full_name')}
                  />
                </div>
                {form.formState.errors.full_name && (
                  <p className="text-sm text-destructive">{form.formState.errors.full_name.message}</p>
                )}
              </div>

              {/* Headline */}
              <div className="mt-6 space-y-2">
                <Label htmlFor="headline">Professional Headline</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="headline"
                    type="text"
                    placeholder="Senior Software Engineer at Tech Co"
                    className="h-12 pl-10"
                    {...form.register('headline')}
                  />
                </div>
                {form.formState.errors.headline && (
                  <p className="text-sm text-destructive">{form.formState.errors.headline.message}</p>
                )}
              </div>

              {/* Bio */}
              <div className="mt-6 space-y-2">
                <Label htmlFor="bio">About Me</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Textarea
                    id="bio"
                    placeholder="Tell employers about yourself, your experience, and what you're looking for..."
                    className="min-h-[150px] pl-10 pt-3"
                    {...form.register('bio')}
                  />
                </div>
                {form.formState.errors.bio && (
                  <p className="text-sm text-destructive">{form.formState.errors.bio.message}</p>
                )}
              </div>
            </div>

            {/* Account Type */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-medium">Account Type</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {profile?.is_employer 
                  ? "You're registered as an employer. You can post jobs and manage applications."
                  : "You're registered as a job seeker. You can apply to jobs and track your applications."}
              </p>
            </div>

            <Button type="submit" variant="hero" size="lg" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
