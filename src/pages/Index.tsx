import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedJobs } from '@/components/home/FeaturedJobs';
import { Categories } from '@/components/home/Categories';
import { CTASection } from '@/components/home/CTASection';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturedJobs />
      <Categories />
      <CTASection />
    </Layout>
  );
};

export default Index;
