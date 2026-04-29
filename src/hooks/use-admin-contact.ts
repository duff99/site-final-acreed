import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import type { UpdateContactMessageInput } from '@shared/types';

export function useAdminContactMessages() {
  return useQuery({
    queryKey: ['admin', 'contact-messages'],
    queryFn: () => apiClient.getAdminContactMessages(),
  });
}

export function useAdminContactMessage(id: string) {
  return useQuery({
    queryKey: ['admin', 'contact-messages', id],
    queryFn: () => apiClient.getAdminContactMessage(id),
    enabled: !!id,
  });
}

export function useUpdateContactMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateContactMessageInput }) =>
      apiClient.updateAdminContactMessage(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'contact-messages'] });
    },
  });
}

export function useDeleteContactMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.deleteAdminContactMessage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'contact-messages'] });
    },
  });
}
