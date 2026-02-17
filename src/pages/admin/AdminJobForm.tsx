import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, Plus, X, ArrowLeft } from 'lucide-react';
import { createJobSchema } from '@shared/schemas';
import type { CreateJobInput } from '@shared/types';
import { useAdminJob, useCreateJob, useUpdateJob } from '@/hooks/use-jobs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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

const sectors = ['Télécoms', 'IT & Digital', 'Cybersécurité', 'Énergie Renouvelable', 'Industrie'];
const jobTypes = ['CDI', 'CDD', 'Freelance', 'Stage', 'Alternance'];
const remoteOptions = ['Sur site', 'Hybride', 'Full remote'];
const experienceLevels = ['0-2 ans', '3-5 ans', '5+ ans', '10+ ans'];

// Schema for the form — skills/responsibilities/profile/advantages as arrays of objects for useFieldArray
const formSchema = createJobSchema;

export default function AdminJobForm() {
  const { id } = useParams();
  const isEditing = !!id && id !== 'new';
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: existingJob, isLoading: isLoadingJob } = useAdminJob(id || '');
  const createJob = useCreateJob();
  const updateJob = useUpdateJob();

  const form = useForm<CreateJobInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'CDI',
      location: '',
      title: '',
      description: '',
      sector: 'Télécoms',
      experience: '3-5 ans',
      skills: [''],
      fullDescription: '',
      responsibilities: [''],
      profile: [''],
      advantages: [''],
      remote: 'Hybride',
      publishedDate: new Date().toISOString().slice(0, 10),
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (existingJob && isEditing) {
      form.reset({
        type: existingJob.type,
        location: existingJob.location,
        title: existingJob.title,
        description: existingJob.description,
        sector: existingJob.sector,
        experience: existingJob.experience,
        skills: existingJob.skills.length > 0 ? existingJob.skills : [''],
        fullDescription: existingJob.fullDescription,
        responsibilities:
          existingJob.responsibilities.length > 0 ? existingJob.responsibilities : [''],
        profile: existingJob.profile.length > 0 ? existingJob.profile : [''],
        advantages: existingJob.advantages.length > 0 ? existingJob.advantages : [''],
        remote: existingJob.remote,
        publishedDate: existingJob.publishedDate,
      });
    }
  }, [existingJob, isEditing, form]);

  const onSubmit = async (data: CreateJobInput) => {
    // Filter out empty strings from arrays
    const cleanData = {
      ...data,
      skills: data.skills.filter((s) => s.trim() !== ''),
      responsibilities: data.responsibilities.filter((r) => r.trim() !== ''),
      profile: data.profile.filter((p) => p.trim() !== ''),
      advantages: data.advantages.filter((a) => a.trim() !== ''),
    };

    try {
      if (isEditing) {
        await updateJob.mutateAsync({ id: id!, data: cleanData });
        toast({ title: 'Offre modifiée avec succès' });
      } else {
        await createJob.mutateAsync(cleanData);
        toast({ title: 'Offre créée avec succès' });
      }
      navigate('/admin/jobs');
    } catch (err) {
      toast({
        title: 'Erreur',
        description: err instanceof Error ? err.message : 'Erreur inconnue',
        variant: 'destructive',
      });
    }
  };

  if (isEditing && isLoadingJob) {
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
          onClick={() => navigate('/admin/jobs')}
          className="text-white/50 hover:text-white hover:bg-white/[0.04] transition-all duration-300 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gradient font-playfair">
            {isEditing ? 'Modifier l\'offre' : 'Nouvelle offre'}
          </h1>
          {isEditing && existingJob && (
            <p className="text-white/40 text-sm mt-1">{existingJob.title}</p>
          )}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info */}
          <Card className="admin-card">
            <CardHeader>
              <CardTitle className="text-white text-lg">Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/70">Titre du poste</FormLabel>
                    <FormControl>
                      <Input placeholder="ex: Architecte Réseau 5G" className={inputClass} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/70">Description courte</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="ex: Architecture SA/NSA, slicing réseau"
                        className={inputClass}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/70">Type de contrat</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className={inputClass}>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-zinc-950/95 backdrop-blur-2xl border-white/[0.08]">
                          {jobTypes.map((type) => (
                            <SelectItem key={type} value={type} className="text-white">
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sector"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/70">Secteur</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className={inputClass}>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-zinc-950/95 backdrop-blur-2xl border-white/[0.08]">
                          {sectors.map((s) => (
                            <SelectItem key={s} value={s} className="text-white">
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/70">Expérience</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className={inputClass}>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-zinc-950/95 backdrop-blur-2xl border-white/[0.08]">
                          {experienceLevels.map((exp) => (
                            <SelectItem key={exp} value={exp} className="text-white">
                              {exp}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/70">Localisation</FormLabel>
                      <FormControl>
                        <Input placeholder="ex: Lyon" className={inputClass} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="remote"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/70">Télétravail</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className={inputClass}>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-zinc-950/95 backdrop-blur-2xl border-white/[0.08]">
                          {remoteOptions.map((r) => (
                            <SelectItem key={r} value={r} className="text-white">
                              {r}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="publishedDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/70">Date de publication</FormLabel>
                      <FormControl>
                        <Input type="date" className={inputClass} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Full Description */}
          <Card className="admin-card">
            <CardHeader>
              <CardTitle className="text-white text-lg">Description complète</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="fullDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        rows={6}
                        placeholder="Description détaillée du poste..."
                        className={inputClass}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Dynamic Array Fields */}
          <ArrayField
            form={form}
            name="skills"
            label="Compétences"
            placeholder="ex: React, TypeScript, Node.js..."
          />

          <ArrayField
            form={form}
            name="responsibilities"
            label="Missions principales"
            placeholder="ex: Développer et maintenir les interfaces utilisateur..."
            isTextarea
          />

          <ArrayField
            form={form}
            name="profile"
            label="Profil recherché"
            placeholder="ex: Bac+5 en informatique avec 3-5 ans d'expérience..."
            isTextarea
          />

          <ArrayField
            form={form}
            name="advantages"
            label="Avantages"
            placeholder="ex: Full remote, budget formation, RTT..."
            isTextarea
          />

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              onClick={() => navigate('/admin/jobs')}
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
              {isEditing ? 'Enregistrer les modifications' : 'Créer l\'offre'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

// Reusable dynamic array field component
function ArrayField({
  form,
  name,
  label,
  placeholder,
  isTextarea = false,
}: {
  form: any;
  name: 'skills' | 'responsibilities' | 'profile' | 'advantages';
  label: string;
  placeholder: string;
  isTextarea?: boolean;
}) {
  const values: string[] = form.watch(name) || [''];

  const addItem = () => {
    const current = form.getValues(name) || [];
    form.setValue(name, [...current, '']);
  };

  const removeItem = (index: number) => {
    const current = form.getValues(name) || [];
    if (current.length <= 1) return;
    form.setValue(
      name,
      current.filter((_: string, i: number) => i !== index)
    );
  };

  const updateItem = (index: number, value: string) => {
    const current = form.getValues(name) || [];
    const updated = [...current];
    updated[index] = value;
    form.setValue(name, updated);
  };

  const inputClass = 'bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/30 backdrop-blur-sm rounded-xl transition-all duration-300 focus:border-white/20 focus:bg-white/[0.06] focus:shadow-[0_0_15px_hsla(0,0%,100%,0.05)]';

  return (
    <Card className="admin-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white text-lg">{label}</CardTitle>
        <Button
          type="button"
          size="sm"
          onClick={addItem}
          variant="outline"
          className="rounded-lg px-3 py-1.5 border-white/[0.12] bg-white/[0.05] text-white text-xs hover:bg-white/[0.1]"
        >
          <Plus className="w-4 h-4 mr-1" />
          Ajouter
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {values.map((item: string, index: number) => (
          <div key={index} className="flex gap-2">
            {isTextarea ? (
              <Textarea
                value={item}
                onChange={(e) => updateItem(index, e.target.value)}
                placeholder={placeholder}
                rows={2}
                className={`flex-1 ${inputClass}`}
              />
            ) : (
              <Input
                value={item}
                onChange={(e) => updateItem(index, e.target.value)}
                placeholder={placeholder}
                className={`flex-1 ${inputClass}`}
              />
            )}
            {values.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeItem(index)}
                className="text-white/40 hover:text-red-400 hover:bg-red-400/10 shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
