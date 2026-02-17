import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
import { z } from 'zod';
import { adminRoleSchema } from '@shared/schemas';
import { useAdminUser, useCreateAdmin, useUpdateAdmin } from '@/hooks/use-admin-users';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

// Form schema: password required on create, optional on edit
const createFormSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caracteres'),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caracteres'),
  role: adminRoleSchema,
});

const editFormSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caracteres'),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Au moins 8 caracteres').or(z.literal('')).optional(),
  role: adminRoleSchema,
});

type CreateFormValues = z.infer<typeof createFormSchema>;
type EditFormValues = z.infer<typeof editFormSchema>;

export default function AdminUserForm() {
  const { id } = useParams();
  const isEditing = !!id && id !== 'new';
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: existingUser, isLoading: isLoadingUser } = useAdminUser(id || '');
  const createAdmin = useCreateAdmin();
  const updateAdmin = useUpdateAdmin();

  const form = useForm<CreateFormValues | EditFormValues>({
    resolver: zodResolver(isEditing ? editFormSchema : createFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'editor',
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (existingUser && isEditing) {
      form.reset({
        name: existingUser.name,
        email: existingUser.email,
        password: '',
        role: existingUser.role,
      });
    }
  }, [existingUser, isEditing, form]);

  const onSubmit = async (data: CreateFormValues | EditFormValues) => {
    try {
      if (isEditing) {
        const updateData: Record<string, any> = {
          name: data.name,
          email: data.email,
          role: data.role,
        };
        if (data.password && data.password.length > 0) {
          updateData.password = data.password;
        }
        await updateAdmin.mutateAsync({ id: id!, data: updateData });
        toast({ title: 'Utilisateur modifie avec succes' });
      } else {
        await createAdmin.mutateAsync(data as CreateFormValues);
        toast({ title: 'Utilisateur cree avec succes' });
      }
      navigate('/admin/users');
    } catch (err) {
      toast({
        title: 'Erreur',
        description: err instanceof Error ? err.message : 'Erreur inconnue',
        variant: 'destructive',
      });
    }
  };

  if (isEditing && isLoadingUser) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64 bg-white/10" />
        <Skeleton className="h-96 w-full bg-white/10" />
      </div>
    );
  }

  const inputClass = 'bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/30 backdrop-blur-sm rounded-xl transition-all duration-300 focus:border-white/20 focus:bg-white/[0.06] focus:shadow-[0_0_15px_hsla(0,0%,100%,0.05)]';

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/admin/users')}
          className="text-white/50 hover:text-white hover:bg-white/[0.04] transition-all duration-300 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gradient font-playfair">
            {isEditing ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
          </h1>
          {isEditing && existingUser && (
            <p className="text-white/40 text-sm mt-1">{existingUser.name}</p>
          )}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
          <Card className="admin-card">
            <CardHeader>
              <CardTitle className="text-white text-lg">Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/70">Nom complet</FormLabel>
                    <FormControl>
                      <Input placeholder="ex: Jean Dupont" className={inputClass} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/70">Email</FormLabel>
                    <FormControl>
                      <Input type="email" autoComplete="off" placeholder="ex: jean@acreedconsulting.com" className={inputClass} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/70">
                      Mot de passe{isEditing && ' (laisser vide pour ne pas modifier)'}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="new-password"
                        placeholder={isEditing ? '••••••••' : 'Min. 8 caracteres'}
                        className={inputClass}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/70">Role</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className={inputClass}>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-zinc-950/95 backdrop-blur-2xl border-white/[0.08]">
                        <SelectItem value="admin" className="text-white">
                          Admin — Acces complet
                        </SelectItem>
                        <SelectItem value="editor" className="text-white">
                          Editeur — Gestion des offres
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              onClick={() => navigate('/admin/users')}
              variant="outline"
              className="rounded-xl px-6 py-2.5 border-white/[0.12] bg-white/[0.05] text-white font-medium hover:bg-white/[0.1]"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="rounded-xl px-6 py-2.5 font-medium bg-white text-black hover:bg-white/90"
            >
              {form.formState.isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {isEditing ? 'Enregistrer les modifications' : 'Creer l\'utilisateur'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
