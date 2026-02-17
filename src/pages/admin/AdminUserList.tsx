import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search, Shield, UserCheck } from 'lucide-react';
import { useAdminUsers, useDeleteAdmin } from '@/hooks/use-admin-users';
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

function getRoleLabel(role: string) {
  return role === 'admin' ? 'Admin' : 'Editeur';
}

function getRoleIcon(role: string) {
  return role === 'admin' ? Shield : UserCheck;
}

export default function AdminUserList() {
  const { data: users, isLoading } = useAdminUsers();
  const deleteAdmin = useDeleteAdmin();
  const { toast } = useToast();
  const [search, setSearch] = useState('');

  const filteredUsers = users?.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      await deleteAdmin.mutateAsync(id);
      toast({ title: 'Utilisateur desactive' });
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
          <h1 className="text-2xl font-bold text-gradient font-playfair">Utilisateurs</h1>
          <p className="text-white/40 text-sm mt-1">
            {users?.length || 0} utilisateurs au total
          </p>
        </div>
        <Link to="/admin/users/new">
          <Button className="rounded-xl px-5 py-2.5 font-medium text-sm bg-white text-black hover:bg-white/90">
            <Plus className="w-4 h-4 mr-2" />
            Nouvel utilisateur
          </Button>
        </Link>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <Input
          placeholder="Rechercher par nom ou email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/30 backdrop-blur-sm rounded-xl transition-all duration-300 focus:border-white/20 focus:bg-white/[0.06]"
        />
      </div>

      <div className="admin-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.06] hover:bg-transparent">
              <TableHead className="text-white/60">Nom</TableHead>
              <TableHead className="text-white/60">Email</TableHead>
              <TableHead className="text-white/60">Role</TableHead>
              <TableHead className="text-white/60">Statut</TableHead>
              <TableHead className="text-white/60">Derniere connexion</TableHead>
              <TableHead className="text-white/60 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i} className="border-white/[0.06]">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-20 bg-white/10" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : filteredUsers?.length === 0 ? (
              <TableRow className="border-white/[0.06]">
                <TableCell colSpan={6} className="text-center text-white/40 py-8">
                  Aucun utilisateur trouve
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers?.map((user) => {
                const RoleIcon = getRoleIcon(user.role);
                return (
                  <TableRow
                    key={user.id}
                    className="border-white/[0.06] transition-all duration-300 hover:bg-white/[0.04]"
                  >
                    <TableCell className="text-white font-medium">{user.name}</TableCell>
                    <TableCell className="text-white/70">{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-white/[0.15] text-white/70 gap-1.5"
                      >
                        <RoleIcon className="w-3 h-3" />
                        {getRoleLabel(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1.5 text-sm ${user.isActive ? 'text-green-400' : 'text-white/40'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-green-400' : 'bg-white/30'}`} />
                        {user.isActive ? 'Actif' : 'Inactif'}
                      </span>
                    </TableCell>
                    <TableCell className="text-white/50 text-sm">
                      {user.lastLoginAt
                        ? new Date(user.lastLoginAt).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : 'Jamais'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/admin/users/${user.id}/edit`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white/50 hover:text-white hover:bg-white/[0.08] transition-all duration-300 rounded-lg"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </Link>
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
                                Desactiver cet utilisateur ?
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-white/60">
                                L'utilisateur "{user.name}" ne pourra plus se connecter.
                                Vous pourrez le reactiver a tout moment.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-white/[0.08] text-white hover:bg-white/[0.04] transition-all duration-300">
                                Annuler
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(user.id)}
                                className="bg-red-500 text-white hover:bg-red-600"
                              >
                                Desactiver
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
