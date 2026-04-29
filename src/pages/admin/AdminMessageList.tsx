import { useState } from 'react';
import { Mail, MailOpen, Trash2, Search, Phone } from 'lucide-react';
import {
  useAdminContactMessages,
  useUpdateContactMessage,
  useDeleteContactMessage,
} from '@/hooks/use-admin-contact';
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
import type { ContactMessage } from '@shared/types';

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

export default function AdminMessageList() {
  const { data: messages, isLoading } = useAdminContactMessages();
  const updateMsg = useUpdateContactMessage();
  const deleteMsg = useDeleteContactMessage();
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  const filtered = messages?.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase()),
  );

  const unreadCount = messages?.filter((m) => !m.isRead).length ?? 0;

  const handleOpen = async (msg: ContactMessage) => {
    setSelected(msg);
    if (!msg.isRead) {
      try {
        await updateMsg.mutateAsync({ id: msg.id, data: { isRead: true } });
      } catch {
        // silent — viewing should not error out
      }
    }
  };

  const handleToggleRead = async (msg: ContactMessage) => {
    try {
      await updateMsg.mutateAsync({ id: msg.id, data: { isRead: !msg.isRead } });
      toast({ title: msg.isRead ? 'Marqué non lu' : 'Marqué lu' });
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
      await deleteMsg.mutateAsync(id);
      toast({ title: 'Message supprimé' });
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
          <h1 className="text-2xl font-bold text-gradient font-playfair">Messages de contact</h1>
          <p className="text-white/40 text-sm mt-1">
            {messages?.length ?? 0} message{(messages?.length ?? 0) > 1 ? 's' : ''} —{' '}
            {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <Input
          placeholder="Rechercher par nom, email ou sujet..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/30 backdrop-blur-sm rounded-xl transition-all duration-300 focus:border-white/20 focus:bg-white/[0.06]"
        />
      </div>

      <div className="admin-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.06] hover:bg-transparent">
              <TableHead className="text-white/60 w-10"></TableHead>
              <TableHead className="text-white/60">Date</TableHead>
              <TableHead className="text-white/60">Expéditeur</TableHead>
              <TableHead className="text-white/60">Sujet</TableHead>
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
                  Aucun message
                </TableCell>
              </TableRow>
            ) : (
              filtered?.map((msg) => (
                <TableRow
                  key={msg.id}
                  className={`border-white/[0.06] transition-all duration-300 hover:bg-white/[0.04] ${
                    !msg.isRead ? 'bg-white/[0.02]' : ''
                  }`}
                  onClick={() => handleOpen(msg)}
                >
                  <TableCell>
                    {msg.isRead ? (
                      <MailOpen className="w-4 h-4 text-white/30" />
                    ) : (
                      <Mail className="w-4 h-4 text-white" />
                    )}
                  </TableCell>
                  <TableCell className="text-white/60 text-sm">
                    {formatDate(msg.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className={msg.isRead ? 'text-white/70' : 'text-white font-medium'}>
                      {msg.name}
                    </div>
                    <div className="text-white/40 text-xs">{msg.email}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-white/[0.15] text-white/70">
                      {msg.subject}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div
                      className="flex items-center justify-end gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleRead(msg)}
                        className="text-white/50 hover:text-white hover:bg-white/[0.08] transition-all duration-300 rounded-lg"
                      >
                        {msg.isRead ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
                      </Button>
                      {isAdmin && (
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
                          <AlertDialogContent className="bg-zinc-950/95 backdrop-blur-2xl border-white/[0.08]">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-white">
                                Supprimer ce message ?
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-white/60">
                                Cette action est définitive. Le message de "{msg.name}" sera
                                supprimé.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-white/[0.08] text-white hover:bg-white/[0.04]">
                                Annuler
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(msg.id)}
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
          className="bg-zinc-950/95 backdrop-blur-2xl border-white/[0.08] text-white sm:max-w-xl"
        >
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="text-white font-playfair">{selected.subject}</SheetTitle>
                <SheetDescription className="text-white/50">
                  {formatDate(selected.createdAt)}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div>
                  <div className="text-white/40 text-xs uppercase tracking-wider mb-1">De</div>
                  <div className="text-white">{selected.name}</div>
                  <a
                    href={`mailto:${selected.email}`}
                    className="text-[#dbcca5] hover:underline text-sm"
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
                <div className="pt-4 border-t border-white/[0.08]">
                  <div className="text-white/40 text-xs uppercase tracking-wider mb-2">
                    Message
                  </div>
                  <p className="text-white/80 whitespace-pre-wrap leading-relaxed">
                    {selected.message}
                  </p>
                </div>
                <div className="pt-4 border-t border-white/[0.08] flex gap-2">
                  <Button
                    asChild
                    className="flex-1 rounded-xl bg-white text-black hover:bg-white/90"
                  >
                    <a href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}>
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
