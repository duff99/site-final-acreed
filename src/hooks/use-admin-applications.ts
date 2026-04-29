import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import type { UpdateApplicationInput } from '@shared/types';

export function useAdminApplications() {
  return useQuery({
    queryKey: ['admin', 'applications'],
    queryFn: () => apiClient.getAdminApplications(),
  });
}

export function useAdminApplication(id: string) {
  return useQuery({
    queryKey: ['admin', 'applications', id],
    queryFn: () => apiClient.getAdminApplication(id),
    enabled: !!id,
  });
}

export function useUpdateApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateApplicationInput }) =>
      apiClient.updateAdminApplication(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'applications'] });
    },
  });
}

export function useDeleteApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.deleteAdminApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'applications'] });
    },
  });
}
