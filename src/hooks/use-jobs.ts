import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { jobs as staticJobs } from '@/data/jobs';
import type { CreateJobInput, UpdateJobInput } from '@shared/types';

export function useJobs(sector?: string) {
  return useQuery({
    queryKey: ['jobs', sector],
    queryFn: () => apiClient.getJobs(sector),
    placeholderData: staticJobs,
    staleTime: 5 * 60 * 1000,
  });
}

export function useJob(id: string | undefined) {
  return useQuery({
    queryKey: ['jobs', id],
    queryFn: () => apiClient.getJob(id!),
    enabled: !!id,
  });
}

export function useAdminJobs() {
  return useQuery({
    queryKey: ['admin', 'jobs'],
    queryFn: () => apiClient.getAdminJobs(),
  });
}

export function useAdminJob(id: string) {
  return useQuery({
    queryKey: ['admin', 'jobs', id],
    queryFn: () => apiClient.getAdminJob(id),
    enabled: !!id && id !== 'new',
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateJobInput) => apiClient.createJob(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'jobs'] });
    },
  });
}

export function useUpdateJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateJobInput }) =>
      apiClient.updateJob(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'jobs'] });
    },
  });
}

export function useDeleteJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'jobs'] });
    },
  });
}

export function useToggleJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.toggleJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'jobs'] });
    },
  });
}
