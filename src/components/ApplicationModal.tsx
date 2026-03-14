import { useState } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api';
import { createApplicationSchema } from '@shared/schemas';
import type { CreateApplicationInput } from '@shared/types';

interface ApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: string;
  jobTitle: string;
}

const ApplicationModal = ({
  open,
  onOpenChange,
  jobId,
  jobTitle,
}: ApplicationModalProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateApplicationInput>({
    resolver: zodResolver(createApplicationSchema),
    defaultValues: {
      jobId,
      jobTitle,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      cvUrl: '',
      message: '',
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
      await apiClient.submitApplication(data);
      toast({
        title: 'Candidature envoyee !',
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
            Postuler : {jobTitle}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Remplissez le formulaire ci-dessous. Nous vous recontacterons
            dans les plus brefs delais.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    Message{' '}
                    <span className="text-white/30 font-normal">(optionnel)</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Presentez-vous brievement..."
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
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
