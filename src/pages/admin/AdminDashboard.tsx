import { Link } from 'react-router-dom';
import { Briefcase, Plus, CheckCircle, XCircle } from 'lucide-react';
import { useAdminJobs } from '@/hooks/use-jobs';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboard() {
  const { data: jobs, isLoading } = useAdminJobs();
  const { hasPermission } = useAuth();

  const totalJobs = jobs?.length || 0;
  const activeJobs = jobs?.filter((j) => j.isActive).length || 0;
  const inactiveJobs = totalJobs - activeJobs;

  const stats = [
    { label: 'Total offres', value: totalJobs, icon: Briefcase, color: 'text-white' },
    { label: 'Actives', value: activeJobs, icon: CheckCircle, color: 'text-green-400' },
    { label: 'Inactives', value: inactiveJobs, icon: XCircle, color: 'text-white/40' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gradient font-playfair">Dashboard</h1>
          <p className="text-white/40 text-sm mt-1">
            Vue d'ensemble de vos offres d'emploi
          </p>
        </div>
        {hasPermission('create_jobs') && (
          <Link to="/admin/jobs/new">
            <Button className="rounded-xl px-5 py-2.5 font-medium text-sm bg-white text-black hover:bg-white/90">
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle offre
            </Button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="admin-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white/60">
                {stat.label}
              </CardTitle>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16 bg-white/10" />
              ) : (
                <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="admin-card">
        <CardHeader>
          <CardTitle className="text-white text-lg">Actions rapides</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3">
          {hasPermission('create_jobs') && (
            <Link to="/admin/jobs/new">
              <Button variant="outline" className="rounded-xl px-4 py-2 border-white/[0.12] bg-white/[0.05] text-white text-sm hover:bg-white/[0.1]">
                <Plus className="w-4 h-4 mr-2" />
                Creer une offre
              </Button>
            </Link>
          )}
          <Link to="/admin/jobs">
            <Button variant="outline" className="rounded-xl px-4 py-2 border-white/[0.12] bg-white/[0.05] text-white text-sm hover:bg-white/[0.1]">
              <Briefcase className="w-4 h-4 mr-2" />
              Voir toutes les offres
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
