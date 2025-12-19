import { Link } from 'react-router-dom';
import { 
  Code, 
  Palette, 
  TrendingUp, 
  HeartPulse, 
  GraduationCap, 
  Building2,
  Megaphone,
  Wrench,
  ArrowRight
} from 'lucide-react';

const categories = [
  { name: 'Technology', icon: Code, jobs: '2,340', color: 'bg-blue-500/10 text-blue-600' },
  { name: 'Design', icon: Palette, jobs: '1,230', color: 'bg-pink-500/10 text-pink-600' },
  { name: 'Finance', icon: TrendingUp, jobs: '980', color: 'bg-green-500/10 text-green-600' },
  { name: 'Healthcare', icon: HeartPulse, jobs: '1,450', color: 'bg-red-500/10 text-red-600' },
  { name: 'Education', icon: GraduationCap, jobs: '890', color: 'bg-amber-500/10 text-amber-600' },
  { name: 'Real Estate', icon: Building2, jobs: '560', color: 'bg-purple-500/10 text-purple-600' },
  { name: 'Marketing', icon: Megaphone, jobs: '1,100', color: 'bg-orange-500/10 text-orange-600' },
  { name: 'Engineering', icon: Wrench, jobs: '2,100', color: 'bg-cyan-500/10 text-cyan-600' },
];

export function Categories() {
  return (
    <section className="bg-secondary/50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="font-serif text-3xl font-medium md:text-4xl">
            Explore by Category
          </h2>
          <p className="mt-2 text-muted-foreground">
            Find opportunities in your field of expertise
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              to={`/jobs?industry=${category.name.toLowerCase()}`}
              className="group animate-scale-in rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${category.color}`}>
                <category.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-medium">{category.name}</h3>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{category.jobs} jobs</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
