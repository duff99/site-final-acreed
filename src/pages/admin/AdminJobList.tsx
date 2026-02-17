import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { useAdminJobs, useDeleteJob, useToggleJob } from '@/hooks/use-jobs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

export default function AdminJobList() {
  const { data: jobs, isLoading } = useAdminJobs();
  const deleteJob = useDeleteJob();
  const toggleJob = useToggleJob();
  const { toast } = useToast();
  const { hasPermission } = useAuth();
  const [search, setSearch] = useState('');

  const filteredJobs = jobs?.filter((job) =>
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.sector.toLowerCase().includes(search.toLowerCase()) ||
    job.location.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggle = async (id: string) => {
    try {
      await toggleJob.mutateAsync(id);
      toast({ title: 'Statut modifie' });
    } catch (err) {
      toast({
        title: 'Erreur',
        description: err instanceof Error ? err.message : 'Erreur inconnue',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteJob.mutateAsync(id);
      toast({ title: 'Offre desactivee' });
    } catch (err) {
      toast({
        title: 'Erreur',
        description: err instanceof Error ? err.message : 'Erreur inconnue',
        variant: 'destructive',
      });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gradient font-playfair">Offres d'emploi</h1>
          <p className="text-white/40 text-sm mt-1">
            {jobs?.length || 0} offres au total
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

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <Input
          placeholder="Rechercher par titre, secteur ou lieu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/30 backdrop-blur-sm rounded-xl transition-all duration-300 focus:border-white/20 focus:bg-white/[0.06]"
        />
      </div>

      <div className="admin-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.06] hover:bg-transparent">
              <TableHead className="text-white/60">Titre</TableHead>
              <TableHead className="text-white/60">Secteur</TableHead>
              <TableHead className="text-white/60">Lieu</TableHead>
              <TableHead className="text-white/60">Type</TableHead>
              <TableHead className="text-white/60">Remote</TableHead>
              <TableHead className="text-white/60">Actif</TableHead>
              <TableHead className="text-white/60 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i} className="border-white/[0.06]">
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-20 bg-white/10" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : filteredJobs?.length === 0 ? (
              <TableRow className="border-white/[0.06]">
                <TableCell colSpan={7} className="text-center text-white/40 py-8">
                  Aucune offre trouvee
                </TableCell>
              </TableRow>
            ) : (
              filteredJobs?.map((job) => (
                <TableRow
                  key={job.id}
                  className="border-white/[0.06] transition-all duration-300 hover:bg-white/[0.04]"
                >
                  <TableCell className="text-white font-medium">{job.title}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="border-white/[0.15] text-white/70"
                    >
                      {job.sector}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-white/70">{job.location}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="bg-white/[0.08] text-white/70"
                    >
                      {job.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-white/70">{job.remote}</TableCell>
                  <TableCell>
                    <Switch
                      checked={job.isActive}
                      onCheckedChange={() => handleToggle(job.id)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/admin/jobs/${job.id}/edit`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white/50 hover:text-white hover:bg-white/[0.08] transition-all duration-300 rounded-lg"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </Link>
                      {hasPermission('delete_jobs') && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-400/60 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-zinc-950/95 backdrop-blur-2xl border-white/[0.08] shadow-[0_20px_60px_hsla(0,0%,0%,0.5)]">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-white">
                                Desactiver cette offre ?
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-white/60">
                                L'offre "{job.title}" sera masquee du site public. Vous
                                pourrez la reactiver a tout moment.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-white/[0.08] text-white hover:bg-white/[0.04] transition-all duration-300">
                                Annuler
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(job.id)}
                                className="bg-red-500 text-white hover:bg-red-600"
                              >
                                Desactiver
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
