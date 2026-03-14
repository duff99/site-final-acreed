import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UploadCloud, X, FileText, Loader2 } from 'lucide-react';
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const applicationSchema = z.object({
  firstName: z.string().min(1, 'Le prénom est requis'),
  lastName: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  reason: z.enum(['CDI', 'Freelance', 'Stage/Alternance'], {
    required_error: 'Sélectionnez une raison',
  }),
  message: z.string().optional(),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

interface SpontaneousApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const SpontaneousApplicationModal = ({
  open,
  onOpenChange,
}: SpontaneousApplicationModalProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvError, setCvError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      message: '',
    },
  });

  const isFormDirty = form.formState.isDirty || cvFile !== null;

  const validateAndSetFile = (file: File) => {
    setCvError(null);
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setCvError('Format accepté : PDF ou DOCX uniquement');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setCvError('Le fichier ne doit pas dépasser 5 Mo');
      return;
    }
    setCvFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSetFile(file);
    // Reset input pour permettre de re-selectionner le meme fichier
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndSetFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const removeFile = () => {
    setCvFile(null);
    setCvError(null);
  };

  const resetAll = () => {
    form.reset();
    setCvFile(null);
    setCvError(null);
    setIsSubmitting(false);
  };

  const onSubmit = async (data: ApplicationFormValues) => {
    setIsSubmitting(true);
    // Simulation d'appel API
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast({
      title: 'Candidature envoyée !',
      description: 'Nous reviendrons vers vous rapidement.',
    });
    resetAll();
    onOpenChange(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) resetAll();
    onOpenChange(nextOpen);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} o`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
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
            Candidature Spontanée
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Envoyez-nous votre candidature. Nous vous recontacterons dans les
            plus brefs délais.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Prénom + Nom */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80">Prénom</FormLabel>
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

            {/* Raison du contact */}
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/80">
                    Raison du contact
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Sélectionnez une raison" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-zinc-950 border-white/10">
                      <SelectItem value="CDI">CDI</SelectItem>
                      <SelectItem value="Freelance">Freelance</SelectItem>
                      <SelectItem value="Stage/Alternance">
                        Stage / Alternance
                      </SelectItem>
                    </SelectContent>
                  </Select>
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
                    <span className="text-white/30 font-normal">
                      (optionnel)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Présentez-vous brièvement..."
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Zone CV */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">
                CV{' '}
                <span className="text-white/30 font-normal">(optionnel)</span>
              </label>

              {!cvFile ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <UploadCloud className="mx-auto h-8 w-8 text-white/40 mb-2" />
                  <p className="text-sm text-white/60">
                    Glissez votre CV ici ou{' '}
                    <span className="text-white underline">parcourir</span>
                  </p>
                  <p className="text-xs text-white/30 mt-1">
                    PDF, DOCX - 5 Mo max
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-3 border border-white/10 rounded-lg p-3 bg-white/5">
                  <FileText className="h-5 w-5 text-white/60 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{cvFile.name}</p>
                    <p className="text-xs text-white/40">
                      {formatFileSize(cvFile.size)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="p-1 rounded hover:bg-white/10 transition-colors"
                  >
                    <X className="h-4 w-4 text-white/60" />
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="hidden"
              />

              {cvError && (
                <p className="text-sm font-medium text-destructive">
                  {cvError}
                </p>
              )}
            </div>

            {/* Bouton Submit */}
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

export default SpontaneousApplicationModal;
