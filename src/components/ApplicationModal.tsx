import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api';
import { createApplicationSchema } from '@shared/schemas';
import type { CreateApplicationInput, Job } from '@shared/types';

interface ApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When undefined, the modal runs in spontaneous mode (no specific job). */
  job?: Job;
}

const ApplicationModal = ({
  open,
  onOpenChange,
  job,
}: ApplicationModalProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const honeypotRef = useRef<HTMLInputElement>(null);

  const isSpontaneous = job === undefined;

  const form = useForm<CreateApplicationInput>({
    resolver: zodResolver(createApplicationSchema),
    defaultValues: {
      jobId: job?.id ?? '',
      jobTitle: job?.title ?? '',
      isSpontaneous,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      cvUrl: '',
      message: '',
      consent: false as unknown as true,
    },
  });

  const isFormDirty = form.formState.isDirty;

  const resetAll = () => {
    form.reset();
    setIsSubmitting(false);
  };

  const onSubmit = async (data: CreateApplicationInput) => {
    setIsSubmitting(true);
    try {
      await apiClient.submitApplication({
        ...data,
        website: honeypotRef.current?.value ?? '',
      });
      toast({
        title: 'Candidature envoyée !',
        description: 'Nous reviendrons vers vous rapidement.',
      });
      resetAll();
      onOpenChange(false);
    } catch (err: any) {
      toast({
        title: 'Erreur',
        description: err.message || 'Une erreur est survenue.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) resetAll();
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="bg-zinc-950 border-white/10 backdrop-blur-xl max-w-lg max-h-[90vh] overflow-y-auto"
        onPointerDownOutside={(e) => {
          if (isFormDirty) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (isFormDirty) e.preventDefault();
        }}
        onInteractOutside={(e) => {
          if (isFormDirty) e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-display text-white">
            {isSpontaneous ? 'Candidature spontanée' : `Postuler : ${job!.title}`}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isSpontaneous
              ? 'Envoyez-nous votre candidature. Nous étudions chaque profil avec attention et vous recontactons dès qu\'une opportunité se présente.'
              : 'Remplissez le formulaire ci-dessous. Nous vous recontacterons dans les plus brefs délais.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Honeypot — bots fill it, the API drops those silently. */}
            <div
              aria-hidden="true"
              style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}
            >
              <label htmlFor="application-website">Ne pas remplir</label>
              <input
                ref={honeypotRef}
                id="application-website"
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                defaultValue=""
              />
            </div>

            {/* Prenom + Nom */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80">Prenom</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Jean"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80">Nom</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Dupont"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/80">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="jean.dupont@email.com"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Telephone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/80">
                    Telephone{' '}
                    <span className="text-white/30 font-normal">(optionnel)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="06 12 34 56 78"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Lien CV */}
            <FormField
              control={form.control}
              name="cvUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/80">
                    Lien vers votre CV{' '}
                    <span className="text-white/30 font-normal">(LinkedIn, Drive, etc.)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://linkedin.com/in/..."
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Message */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/80">
                    {isSpontaneous ? 'Poste recherché / Message' : 'Message'}{' '}
                    <span className="text-white/30 font-normal">(optionnel)</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={
                        isSpontaneous
                          ? 'Présentez-vous et indiquez le type de poste recherché...'
                          : 'Presentez-vous brievement...'
                      }
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Consent (RGPD) */}
            <FormField
              control={form.control}
              name="consent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start gap-3 rounded-md border border-white/[0.08] p-3 bg-white/[0.02]">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="mt-0.5 border-white/30 data-[state=checked]:bg-white data-[state=checked]:text-black"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-snug">
                    <FormLabel className="text-white/70 text-sm font-normal">
                      J'accepte que mes données soient traitées dans le cadre de cette
                      candidature, conformément à la{' '}
                      <Link
                        to="/confidentialite"
                        target="_blank"
                        className="text-[#dbcca5] underline hover:text-white"
                      >
                        politique de confidentialité
                      </Link>
                      .
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-white text-black hover:bg-white/90 font-medium h-11"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                'Envoyer ma candidature'
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationModal;
