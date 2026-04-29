import { useState } from 'react';
import { FileText, Trash2, Search, Phone, ExternalLink } from 'lucide-react';
import {
  useAdminApplications,
  useUpdateApplication,
  useDeleteApplication,
} from '@/hooks/use-admin-applications';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import type { Application, ApplicationStatus } from '@shared/types';

const STATUS_OPTIONS: { value: ApplicationStatus; label: string }[] = [
  { value: 'new', label: 'Nouvelle' },
  { value: 'reviewing', label: 'En cours' },
  { value: 'contacted', label: 'Contactée' },
  { value: 'rejected', label: 'Refusée' },
  { value: 'archived', label: 'Archivée' },
];

const STATUS_VARIANT: Record<ApplicationStatus, string> = {
  new: 'bg-emerald-400/15 text-emerald-300 border-emerald-400/30',
  reviewing: 'bg-blue-400/15 text-blue-300 border-blue-400/30',
  contacted: 'bg-violet-400/15 text-violet-300 border-violet-400/30',
  rejected: 'bg-red-400/15 text-red-300 border-red-400/30',
  archived: 'bg-white/10 text-white/50 border-white/20',
};

function statusLabel(s: ApplicationStatus) {
  return STATUS_OPTIONS.find((o) => o.value === s)?.label ?? s;
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export default function AdminApplicationList() {
  const { data: apps, isLoading } = useAdminApplications();
  const updateApp = useUpdateApplication();
  const deleteApp = useDeleteApplication();
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Application | null>(null);

  const filtered = apps?.filter(
    (a) =>
      `${a.firstName} ${a.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.jobTitle.toLowerCase().includes(search.toLowerCase()),
  );

  const newCount = apps?.filter((a) => a.status === 'new').length ?? 0;

  const handleStatusChange = async (id: string, status: ApplicationStatus) => {
    try {
      await updateApp.mutateAsync({ id, data: { status } });
      toast({ title: 'Statut mis à jour' });
      if (selected?.id === id) {
        setSelected((s) => (s ? { ...s, status } : s));
      }
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
      await deleteApp.mutateAsync(id);
      toast({ title: 'Candidature supprimée' });
      if (selected?.id === id) setSelected(null);
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
          <h1 className="text-2xl font-bold text-gradient font-playfair">Candidatures</h1>
          <p className="text-white/40 text-sm mt-1">
            {apps?.length ?? 0} candidature{(apps?.length ?? 0) > 1 ? 's' : ''} —{' '}
            {newCount} nouvelle{newCount > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <Input
          placeholder="Rechercher par nom, email ou offre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/30 backdrop-blur-sm rounded-xl transition-all duration-300 focus:border-white/20 focus:bg-white/[0.06]"
        />
      </div>

      <div className="admin-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.06] hover:bg-transparent">
              <TableHead className="text-white/60">Date</TableHead>
              <TableHead className="text-white/60">Candidat</TableHead>
              <TableHead className="text-white/60">Offre</TableHead>
              <TableHead className="text-white/60">Statut</TableHead>
              <TableHead className="text-white/60 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i} className="border-white/[0.06]">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-20 bg-white/10" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : filtered?.length === 0 ? (
              <TableRow className="border-white/[0.06]">
                <TableCell colSpan={5} className="text-center text-white/40 py-8">
                  Aucune candidature
                </TableCell>
              </TableRow>
            ) : (
              filtered?.map((app) => (
                <TableRow
                  key={app.id}
                  className="border-white/[0.06] transition-all duration-300 hover:bg-white/[0.04]"
                  onClick={() => setSelected(app)}
                >
                  <TableCell className="text-white/60 text-sm">
                    {formatDate(app.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="text-white font-medium">
                      {app.firstName} {app.lastName}
                    </div>
                    <div className="text-white/40 text-xs">{app.email}</div>
                  </TableCell>
                  <TableCell className="text-white/70">{app.jobTitle}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={STATUS_VARIANT[app.status as ApplicationStatus] ?? STATUS_VARIANT.archived}
                    >
                      {statusLabel(app.status as ApplicationStatus)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div
                      className="flex items-center justify-end gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {app.cvUrl && (
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="text-white/50 hover:text-white hover:bg-white/[0.08] rounded-lg"
                        >
                          <a href={app.cvUrl} target="_blank" rel="noopener noreferrer">
                            <FileText className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                      {isAdmin && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-400/60 hover:text-red-400 hover:bg-red-400/10 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-zinc-950/95 backdrop-blur-2xl border-white/[0.08]">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-white">
                                Supprimer cette candidature ?
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-white/60">
                                Cette action est définitive. La candidature de "
                                {app.firstName} {app.lastName}" sera supprimée.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-white/[0.08] text-white hover:bg-white/[0.04]">
                                Annuler
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(app.id)}
                                className="bg-red-500 text-white hover:bg-red-600"
                              >
                                Supprimer
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

      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent
          side="right"
          className="bg-zinc-950/95 backdrop-blur-2xl border-white/[0.08] text-white sm:max-w-xl overflow-y-auto"
        >
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="text-white font-playfair">
                  {selected.firstName} {selected.lastName}
                </SheetTitle>
                <SheetDescription className="text-white/50">
                  Candidature pour : {selected.jobTitle}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-5">
                <div>
                  <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Date</div>
                  <div className="text-white/80">{formatDate(selected.createdAt)}</div>
                </div>

                <div>
                  <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Email</div>
                  <a
                    href={`mailto:${selected.email}`}
                    className="text-[#dbcca5] hover:underline"
                  >
                    {selected.email}
                  </a>
                </div>

                {selected.phone && (
                  <div>
                    <div className="text-white/40 text-xs uppercase tracking-wider mb-1">
                      Téléphone
                    </div>
                    <a
                      href={`tel:${selected.phone}`}
                      className="text-white inline-flex items-center gap-2 hover:text-[#dbcca5]"
                    >
                      <Phone className="w-4 h-4" />
                      {selected.phone}
                    </a>
                  </div>
                )}

                {selected.cvUrl && (
                  <div>
                    <div className="text-white/40 text-xs uppercase tracking-wider mb-1">CV</div>
                    <a
                      href={selected.cvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#dbcca5] hover:underline inline-flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Ouvrir le CV
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                {selected.message && (
                  <div className="pt-4 border-t border-white/[0.08]">
                    <div className="text-white/40 text-xs uppercase tracking-wider mb-2">
                      Message
                    </div>
                    <p className="text-white/80 whitespace-pre-wrap leading-relaxed">
                      {selected.message}
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t border-white/[0.08]">
                  <div className="text-white/40 text-xs uppercase tracking-wider mb-2">Statut</div>
                  <Select
                    value={selected.status}
                    onValueChange={(value) =>
                      handleStatusChange(selected.id, value as ApplicationStatus)
                    }
                  >
                    <SelectTrigger className="bg-white/[0.03] border-white/[0.08] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-950 border-white/[0.08] text-white">
                      {STATUS_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 border-t border-white/[0.08] flex gap-2">
                  <Button
                    asChild
                    className="flex-1 rounded-xl bg-white text-black hover:bg-white/90"
                  >
                    <a
                      href={`mailto:${selected.email}?subject=Re: Votre candidature — ${encodeURIComponent(selected.jobTitle)}`}
                    >
                      Répondre par email
                    </a>
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
